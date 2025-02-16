import pdfplumber
import requests
import os
import json
from io import BytesIO
from openai import AzureOpenAI, OpenAI
client = OpenAI(api_key="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")

def extract_text_from_pdf(pdf_path):
    response = requests.get(pdf_path)
    response.raise_for_status()
    text = ""
    with pdfplumber.open(BytesIO(response.content)) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n\n"
    return text

# Example usage
# pdf_path = "document.pdf"
# document_content = extract_text_from_pdf(pdf_path)
# print(document_content)  # Display extracted text

# query = '''3.5 Electrical Work
# For carrying out electrical work, positive isolation of
# electrical energy of power driven equipment is
# essential. A separate permit that is electrical work
# permit shall be issued for the electrical work.
# Annex E shall be followed to issue electrical work
# permit.'''
def _generate_script(query, document_content):
    response = client.chat.completions.create(
        model="gpt-4o-mini", # model = "deployment_name".
        messages=[
            {"role": "system", "content": """You are a helpful assistant. You generate the content for the tutorial.
            The content is generated using the topic provided.
            The content is generated from the document provided.
            The content is used to generate prompts to generate videos for AI.
            """},
            {"role": "system", "content": "Below is the topic/context to genrate the content from the document"},
            {"role": "user", "content": query},
            {"role": "system", "content": "Below is the document to generate the content from"},
            {"role": "user", "content": document_content}
        ]
    )
    return response.choices[0].message.content

def generate_script(event):
    query=event.get('instructions')
    pdf_path=event.get('pdf_path')
    document_content=extract_text_from_pdf(pdf_path)
    return _generate_script(query, document_content)

