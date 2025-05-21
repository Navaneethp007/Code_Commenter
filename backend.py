import ast
import ollama
from flask import Flask, request, send_file
import io

app = Flask(__name__)

def parse_code(code):
    try:
        tree= ast.parse(code)
        elements = []
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                elements.append({
                    'code': ast.get_source_segment(code, node),
                    'start_line': node.lineno,
                })
            elif isinstance(node, ast.ClassDef):
                elements.append({
                    'code': ast.get_source_segment(code, node),
                    'start_line': node.lineno,
                })

        return elements
    except SyntaxError as e:
        return {'error': str(e)}
    
def generate_comments(code):
    prompt=f'''You are an expert code reviewer. Generate concise, meaningful comments for the following code. 
    Focus on explaining the purpose and functionality of the code. Return only the comments, one per line.
    ```comments
    {code}
    ```
    '''
    response = ollama.generate(model="codellama", prompt=prompt)
    comments = response['response'].strip().split('\n')
    return comments
@app.route('/commenter', methods=['POST'])
def main():
    file=request.files['file']
    code = file.read().decode('utf-8')
    elements= parse_code(code)
    codes=code.splitlines()
    offset=0
    for element in elements:
        coments=generate_comments(element['code'])
        com_block=[f"# {comment}" for comment in coments]
        ins=element['start_line']-1+offset
        codes[ins:ins]=com_block
        offset+=len(coments)
    completed_code='\n'.join(codes)
    file_stream=io.BytesIO(completed_code.encode('utf-8'))
    return send_file(
        file_stream,
        mimetype='text/plain',
        as_attachment=True,
        download_name=f'{file.filename}'
    )

if __name__ == "__main__":
    app.run(debug=True)
