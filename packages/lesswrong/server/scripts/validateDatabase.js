/* global Vulcan */
import { Collections, getCollection } from 'meteor/vulcan:lib';
import { forEachDocumentBatchInCollection } from '../queryUtil';

// Validate a collection against its attached schema. Checks that _id is always
// a string, that required fields are present, that unrecognized keys are not
// present, that fields are of the specified type, and that foreign-key fields
// point to rows that actually exist. (CAVEAT: foreign-key fields inside a
// nested schema are not currently handled, only top-level fields.)
//
// Outputs a summary of any problems found through console.log, and returns
// nothing.
export async function validateCollection(collection)
{
  const collectionName = collection.collectionName;
  console.log(`Checking ${collectionName}`); // eslint-disable-line no-console
  const numRows = await collection.find({}).count();
  console.log(`    ${numRows} rows`); // eslint-disable-line no-console
  
  // Check for mixed _id type (string vs ObjectID)
  const rowsWithObjectID = await collection.find({
    _id: {$type: "objectId"}
  }).count();
  if (rowsWithObjectID > 0) {
    console.log(`    ${rowsWithObjectID} have keys of type ObjectID`); // eslint-disable-line no-console
  }
  
  // Validate rows
  const schema = collection.simpleSchema();
  if (!schema) {
    console.log(`    Collection does not have a schema`); // eslint-disable-line no-console
    return;
  }
  
  const validationContext = schema.newContext();
  
  // Dictionary field=>type=>count
  const errorsByField = {};
  
  function recordError(field, errorType) {
    if (!errorsByField[field])
      errorsByField[field] = {};
    if (!errorsByField[field][errorType])
      errorsByField[field][errorType] = 0;
    
    errorsByField[field][errorType]++;
  }
  
  
  await forEachDocumentBatchInCollection({
    collection, batchSize: 10000,
    callback: async (batch) => {
      // Validate documents against their batch with simpl-schema
      for (const document of batch) {
        validationContext.validate(document);
        
        if (!validationContext.isValid()) {
          let errors = validationContext.validationErrors();
          for (let error of errors) {
            recordError(error.name, error.type);
          }
        }
      }
      
      // Iterate through fields checking for the foreignKey property (which
      // simpl-schema doesn't handle), and verifying that the keys actually
      // exist
      for (let fieldName in schema._schema) {
        // TODO: Nested-field foreign key constraints aren't yet supported
        if (fieldName.indexOf("$") >= 0)
          continue;
        
        const foreignKeySpec = schema._schema[fieldName].foreignKey;
        
        if (foreignKeySpec) {
          // Get a list of foreign values to check for
          let foreignValuesDict = {};
          for (const document of batch) {
            if (document[fieldName])
              foreignValuesDict[document[fieldName]] = true;
          }
          const foreignValues = Object.keys(foreignValuesDict);
          
          let foreignField, foreignCollectionName;
          if (typeof foreignKeySpec === "string") {
            foreignField = "_id";
            foreignCollectionName = foreignKeySpec;
          } else {
            foreignField = foreignKeySpec.field;
            foreignCollectionName = foreignKeySpec.collection
            if (typeof foreignField !== "string")
              throw new Error("Expected a field name in foreignKey constraint for ${collectionName}.${fieldName}, value wasn't a string");
            if (typeof foreignCollectionName !== "string")
              throw new Error("Expected a collection name in foreignKey constraint for ${collectionName}.${fieldName}, value wasn't a string");
          }
          const foreignCollection = getCollection(foreignCollectionName);
          
          if (!foreignCollection) {
              //eslint-disable-next-line no-console
              console.error(`    Cannot find collection for foreign-key validation: ${foreignCollectionName}`);
              return;
          }
          
          // Get reduced versions of rows that the foreign-key field refers to
          const foreignRows = await foreignCollection.find({ [foreignField]: {$in: foreignValues} }, { [foreignField]:1 })
          
          // Collect a list of values present
          const foreignValuesFound = {};
          for (const foreignRow of foreignRows)
            foreignValuesFound[foreignRow[foreignField]] = true;
          
          // Compare against values referred to, and report an error for any missing
          for (const document of batch) {
            if (document[fieldName] && !(document[fieldName] in foreignValuesFound)) {
              recordError(fieldName, "foreignKeyViolation");
            }
          }
        }
      }
    }
  });
  
  for (const fieldName of Object.keys(errorsByField)) {
    for (const errorType of Object.keys(errorsByField[fieldName])) {
      const count = errorsByField[fieldName][errorType];
      console.log(`    ${collectionName}.${fieldName}: ${errorType} (${count} rows)`); //eslint-disable-line no-console
    }
  }
}

// Validate each collection in the database against their attached schemas.
// Outputs a summary of the results through console.log, and returns nothing.
export async function validateDatabase()
{
  for (let collection of Collections)
  {
    await validateCollection(collection);
  }
}

Vulcan.validateCollection = validateCollection;
Vulcan.validateDatabase = validateDatabase;