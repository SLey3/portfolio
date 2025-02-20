export const formatEditorContent = (content: any) => {
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (error) {
      // Fallback: Wrap raw text into a minimal editor structure
      return [{
        type: 'paragraph',
        children: [{ text: content }]
      }];
    }
  }
  return content;
};

export const serializeEditorContent = (content: any) => {
  try {
    return typeof content === 'string' ? content : JSON.stringify(content);
  } catch (error) {
    console.error('Error serializing editor content:', error);
    return '';
  }
};