import React,{useState} from 'react';
import '../App.css'
function FileUpload(props) {

      const [file, setFile] = useState();

      const uploadFile = async (e) => {
        e.preventDefault();
        setFile(e.target.files[0]);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        
        try {
          const res = await fetch("http://localhost:3001/" + props.url, {
            method: "post",
            credentials: 'include',
            body: formData
          });
          if(res.ok)
          props.cambiaStato(file);
        } catch (ex) {
          console.log(ex);
        }
      };
      
      return (
        <div className = "UserPhotoUpload">
          <label className='custom-file-upload btn btn-primary'>
              Cambia Foto
              <input type="file" className="" id="file"  name = "file" placeholder="Enter photo" onChange={uploadFile}/>
          </label>
        </div>
      );
}

export default FileUpload;
 
