/**
 * Removes duplicate '::subscription' occurrences in a function name.
 * @param functionName The original function name
 * @returns The function name with duplicate '::subscription' removed
 */
export function removeDuplicateSubscription(functionName: string): string {
  // Split the function name into parts
  const parts = functionName.split("::");

  // Filter out duplicate 'subscription' occurrences
  const uniqueParts = parts.filter((part, index, array) => {
    if (part === "subscription") {
      return index === array.indexOf("subscription");
    }
    return true;
  });

  // Join the parts back together
  return uniqueParts.join("::");
}

// Example usage:
// const originalName = "0x123::subscription::subscription::deposit";
// const correctedName = removeDuplicateSubscription(originalName);
// console.log(correctedName); // Output: "0x123::subscription::deposit"
