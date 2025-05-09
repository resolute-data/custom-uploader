# streamlit-custom-component

Streamlit component that allows you to do X

## Installation instructions

```sh
pip install streamlit-custom-component
```

## Usage instructions

```python
import streamlit as st

from custom_uploader import custom_uploader

uploaded = custom_uploader(accept=".pdf,.docx", limit=32)

if uploaded and isinstance(uploaded, dict):
    import base64
    content_bytes = base64.b64decode(uploaded["content"])

    with open(uploaded["name"], "wb") as f:
        f.write(content_bytes)

    st.success(f"Saved {uploaded['name']} ({uploaded['size']} bytes)")


```