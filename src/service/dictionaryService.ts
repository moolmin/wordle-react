export async function checkWordExists(word: string): Promise<boolean> {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        return false;
      }
  
      const data = await response.json();
  
      if (data.title === "No Definitions Found") {
        return false;
      }
  
      return true;
    } catch (error) {
      console.error('Error fetching the word:', error);
      return false;
    }
  }