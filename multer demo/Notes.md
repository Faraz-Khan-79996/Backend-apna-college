# File input using multer

'Content-Type' or  'enctype' must be form data 'multipart/form-data'.

Multer is a node.js middleware for handling `multipart/form-data`.

**NOTE** : Multer will not process any form which is not multipart (`multipart/form-data`).

Multer adds a `body` object and a `file` or `files` object to the `request` object. The `body` object contains the values of the text fields of the form, the `file` or `files` object contains the files uploaded via the form.



when submitting form from script, to replicate multipart/form-data, use :

```apache
let formData = new FormData();
            formData.append('username', username);
            formData.append('name_of_file', file);
```

create instance of  `FormData()` and append key and values.

```apache
 <input 
            type="file" 
            id="f" 
            name="name_of_file" 
            required
            >
let file = f.files[0];
//input with type 'file' will have 'files' array instead of 'value'
```

```apache
            // In case of axios
            axios.post('https://example.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            //In case of fetch
            fetch('http://localhost:3000/post', {
                method: 'POST',
                body: formData
                //in case of FormData(), content type is set on it's own
            })
```
