import streamlit as st
from custom_uploader import custom_uploader

# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run custom_uploader/example.py`

st.subheader("uploader")
file = custom_uploader(accept="image/png,image/jpeg",key="uploader")
print(file)

