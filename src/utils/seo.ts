/**
 * Helper to dynamically format page titles by replacing the brand name part (after | or -)
 * with the general/brand title fetched from the new dynamic API.
 */
export function getPageTitle(
  pageTitle: string | null | undefined,
  fallbackTitle: string,
  brandName: string
): string {
  const title = pageTitle && pageTitle !== "örnek_metin" && pageTitle.trim() !== "" 
    ? pageTitle.trim() 
    : fallbackTitle;

  // 1. If it contains "|", replace the part after the first "|"
  if (title.includes("|")) {
    const parts = title.split("|");
    return `${parts[0].trim()} | ${brandName}`;
  }

  // 2. If it contains " - ", replace the part after the first " - "
  if (title.includes(" - ")) {
    const parts = title.split(" - ");
    const firstPartLower = parts[0].trim().toLowerCase();
    
    // Special case: if the first part is a variation of "zmrelektronik" or "zmr elektronik",
    // replace the first part with the brand name.
    if (firstPartLower === "zmrelektronik" || firstPartLower === "zmr elektronik") {
      return `${brandName} - ${parts.slice(1).join(" - ").trim()}`;
    }
    
    return `${parts[0].trim()} - ${brandName}`;
  }

  // 3. Fallback: if it's just "Zmrelektronik" or "ZMR Elektronik" or similar
  if (title.toLowerCase() === "zmrelektronik" || title.toLowerCase() === "zmr elektronik") {
    return brandName;
  }

  return title;
}
