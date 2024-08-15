interface Item {
  [key: string]: any; // Use index signature for more flexibility with properties
  children?: any[];   // Array to store multiple matches
}

function groupByNestedMatch(parentArray: Item[], childArray: Item[], nestedKey: string): Item[] {
  parentArray.forEach((parentItem) => {
    // Initialize the children array for each parentItem
    parentItem.children = [];

    // Iterate over the child array and find matches
    for (let i = 0; i < childArray.length; i++) {
      if (getNestedValue(childArray[i], nestedKey) === getNestedValue(parentItem, nestedKey)) {
        // Push the matched item to the children array
        parentItem.children.push(childArray[i]);

        // Remove the matched item from the child array
        childArray.splice(i, 1);

        // Adjust the index to account for the removed element
        i--;
      }
    }
  });

  // Return the modified parentArray
  return parentArray;
}

// Helper function to get nested property value
function getNestedValue(obj: any, nestedKey: string): any {
  return nestedKey.split('.').reduce((acc, key) => acc && acc[key], obj);
}

// Example usage
const programEpic: Item[] = [
  { id: 1, name: 'Program 1', associatedParent: { id: 10 } },
  { id: 2, name: 'Program 2', associatedParent: { id: 20 } },
  { id: 3, name: 'Program 3', associatedParent: { id: 30 } }
];

let epic: Item[] = [
  { id: 1, name: 'Epic 1', associatedParent: { id: 10 } },
  { id: 2, name: 'Epic 2', associatedParent: { id: 20 } },
  { id: 3, name: 'Epic 3', associatedParent: { id: 10 } },
  { id: 4, name: 'Epic 4', associatedParent: { id: 30 } }
];

// Call the function with nested key
const updatedProgramEpic = groupByNestedMatch(programEpic, epic, 'associatedParent.id');

console.log(updatedProgramEpic);
console.log(epic); // Remaining unmatched epics
