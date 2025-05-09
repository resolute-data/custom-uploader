function isFileTypeAccepted (file: File, accept: string): boolean  {
    if (!accept || accept === "*") return true
  
    const acceptedTypes = accept.split(",").map(t => t.trim().toLowerCase())
    const fileType = file.type.toLowerCase()
    const fileName = file.name.toLowerCase()
  

    return acceptedTypes.some(type => {
      if (type.startsWith(".")) {
        // Match by file extension
        return fileName.endsWith(type)
      } else {
        console.log(type,fileType);
        // Match by MIME type
        return fileType === type
      }
    })
  }
  export default isFileTypeAccepted