export const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        const rows = content.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const data = rows.slice(1).map((row) =>
          headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {} as any)
        );
        resolve(data);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  };
  
  export const parseCSVFromURL = async (url: string): Promise<any[]> => {
    const response = await fetch(url);
    const text = await response.text();
    const rows = text.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    return rows.slice(1).map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index];
        return acc;
      }, {} as any)
    );
  };
  
  export const parseCSVFile = (content: string): any[] => {
    const rows = content.split("\n").map((row) => row.split(","));
    const headers = rows[0];
    return rows.slice(1).map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index];
        return acc;
      }, {} as any)
    );
  };
  