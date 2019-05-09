import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import './Pdf.css';
import PDFReader from "react-pdf-reader";
//import { Document, Page } from 'react-pdf';
//import { Document, Page } from "react-pdf/dist/entry.webpack";
import "react-pdf/dist/Page/AnnotationLayer.css";
import samplePDF from '../data/example1.pdf';
import { PDFViewer } from '@react-pdf/renderer';
import "react-pdf-reader/dist/TextLayerBuilder.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;




 export default class pdfContainer extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document;
    this.setState({
      numPages,
      pageNumber: 1,
     
    });
  };

  changePage = offset => this.setState(prevState => ({
    pageNumber: prevState.pageNumber + offset,
  }));

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  render() {
    const { numPages, pageNumber } = this.state;
    const styles = StyleSheet.create({
        page: {
          flexDirection: 'row',
          backgroundColor: '#E4E4E4'
        },
        section: {
          margin: 10,
          padding: 10,
          flexGrow: 1
        }
      });
    const divStyle = {
    display: 'inline-block',
      color: 'orange',
      backgroundColor: 'grey',
      textAlign: 'center',
     
    };

    return (
        
      <div className = 'react_fragment'  style = {divStyle}>
      <React.Fragment style = {divStyle}>
        <p style = {divStyle}>
       
        <Document
          file={samplePDF}
          onLoadSuccess={this.onDocumentLoadSuccess}
          style = {divStyle}
        >
          <Page size = "A1" pageNumber={pageNumber} style={styles.page}   >
          <View style = {styles.section}>
          </View>
          </Page>

        </Document>
   

        </p>
        <div className = "commentPanel">
          <p>
            Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
          </p>
          <button
            type="button"
            disabled={pageNumber <= 1}
            onClick={this.previousPage}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={pageNumber >= numPages}
            onClick={this.nextPage}
          >
            Next
          </button>
          <form className="comment_form">
                <label>
                    Comment:
                    <input type="text" name="pdf_comment"  />
                    <input type="submit" value="Submit" />
                </label>
          </form>
          
                    
              
          </div>
      </React.Fragment>
       </div>
    );
  }
}
