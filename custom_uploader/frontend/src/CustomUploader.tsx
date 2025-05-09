import {
  Streamlit,
  withStreamlitConnection,
  ComponentProps,
} from "streamlit-component-lib"
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ReactElement,
  useRef,
} from "react"
import FileSvg from "./fileSvg"
import isFileTypeAccepted from "./checkFileType"

/**
 * This is a React-based component template. The passed props are coming from the
 * Streamlit library. Your custom args can be accessed via the `args` props.
 */

function humanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) +
    " " +
    ["B", "kB", "MB", "GB", "TB"][i]
  )
}

function CustomUploader({ args, disabled, theme }: ComponentProps): ReactElement {
  const {accept,limit } = args
  console.log(theme)
  const [isFocused, setIsFocused] = useState(false)
  const[error,setError] = useState("false")
  const [files, setFiles] = useState<File[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  const style: React.CSSProperties = useMemo(() => {
    if (!theme) return {}

    // Use the theme object to style our button border. Alternatively, the
    // theme style is defined in CSS vars.
    const borderStyling = `1px solid ${isFocused ? theme.primaryColor : "gray"}`
    return { border: borderStyling, outline: borderStyling }
  }, [theme, isFocused])

  // setFrameHeight should be called on first render and evertime the size might change (e.g. due to a DOM update).
  // Adding the style and theme here since they might effect the visual size of the component.
  useEffect(() => {
    Streamlit.setFrameHeight()
  }, [style, theme, files.length,])

  const MAX_FILE_SIZE = limit * 1024 * 1024

  const handleAddFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || [])
    const file = selected[0]
    setFiles((prev) => [...prev, ...selected])

  if(error!=="false")setError("false")

  if (!file) return

  if (!isFileTypeAccepted(file, accept)) {
    setFiles([])
    setError(`File type not accepted. Allowed: ${accept}`)
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    const updated = [...files]
    updated.splice(0, 1)
    setFiles(updated)
    setError("File too large. Please select a file smaller than 32 MB.")
    return
  }

    if (selected[0]) {
     
      const reader = new FileReader()
  
      reader.onload = () => {
        const base64Data = reader.result?.toString().split(",")[1] // remove data:*/*;base64, prefix
  
        Streamlit.setComponentValue({
          name: file.name,
          type: file.type,
          size: file.size,
          content: base64Data, // base64 string
        })
      }
  
      reader.readAsDataURL(file) // triggers reader.onload
    }
  }
  

  const handleRemove = (index: number) => {
    const updated = [...files]
    updated.splice(index, 1)
    setFiles(updated)
    Streamlit.setComponentValue(null)
  }

  return (
    <>
      <style>{`
       .uploadContainer {
        
         width: 100%;
       }
       .dnd-box {
        background-color: ${theme?.secondaryBackgroundColor};
        border-radius: 3rem;
         padding: 0.3rem;
         position: relative;
         display: flex;
         flex-direction: row;
         justify-content: start;
         align-items: center;
         color: ${theme?.textColor};
         cursor: pointer;
         width: 200px;
       }
        .dnd-box span{
         margin: 0;
         padding-bottom:3px;
       }
        .file-svg{
        width: 40px;
        height:40px;
        fill:${theme?.textColor};
        padding-top:4px;
        }
       .dnd-box.dragover {
         border-color: #3b82f6;
         box-shadow: 0 0 0 4px #bfdbfe inset;
       }
      .filename{
        margin: 0;
        padding-left:35px;
    
      }
       .remove-btn {
         position: absolute;
         top: 0;
         left: 0;
         background:${theme?.backgroundColor};
        color: ${theme?.textColor};
         border-bottom-left-radius: 0.5rem;
         border: none;
         cursor: pointer;
       }
       .drop-overlay {
         position: absolute;
         inset: 0;
         background-color: rgba(191, 219, 254, 0.8);
         z-index: 10;
       }

       .custom-error{
         padding:0.2rem;
         color:red
       }
     `}</style>

      <div className="uploadContainer">
        {files.length > 0 ? (
          <div>
          <button className="remove-btn" onClick={() => handleRemove(0)}>✕</button>  <span className="filename">{`${files[0].name} ${humanFileSize(files[0].size)}`}</span> 
          </div>
        ) : (<>
          <div
            className="dnd-box"
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.classList.add("dragover")
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("dragover")
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.currentTarget.classList.remove("dragover")
              const droppedFiles = Array.from(e.dataTransfer.files)
              setFiles((prev) => [...prev, ...droppedFiles])
            }}
          >
            <input
              type="file"
              accept={accept}
              ref={inputRef}
              disabled={disabled}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                zIndex: 50,
                cursor: "pointer",
              }}
              onChange={handleAddFiles}
            />
            <FileSvg></FileSvg>
            <span>Upload your files</span>
          </div>
          <span className="custom-error">{error=="false"?"":error}</span>
          </>
        )}

      </div>

    </>
  )
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(CustomUploader)
