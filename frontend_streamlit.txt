import streamlit as st
import requests
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import guess_lexer

st.title("Code Commenter")
st.write("Upload the code file you want to comment on.")
uploaded_file = st.file_uploader("Choose a file", type=["py", "java", "cpp", "js"])
if uploaded_file is not None:
   content=uploaded_file.read().decode("utf-8")
   st.subheader("Code Preview")
   high_code= highlight(content, guess_lexer(content), HtmlFormatter(style="colorful"))
   st.markdown( f'<style>{HtmlFormatter().get_style_defs(".highlight")}</style>{high_code}',unsafe_allow_html=True)
   process=st.button("Process Code")
   if process and uploaded_file:
       try:
          url= "http://localhost:5000/commenter"
          files = {"file": (uploaded_file.name, content, "text/plain")}
          response = requests.post(url, files=files)
          if response.status_code == 200:
              comments=response.content.decode("utf-8")
              high_commcode= highlight(comments, guess_lexer(comments), HtmlFormatter(style="colorful"))
              st.subheader("Code with Comments")
              st.download_button(
                   label="Download Comments",
                   data=comments,
                   file_name=f"{uploaded_file.name}",
                   mime="text/plain"
              )
          else:   
              st.error("Error in processing the file.")
       except Exception as e:
           st.error(f"An error occurred: {e}")
                 

        

    
