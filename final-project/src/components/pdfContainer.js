import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf-reader/dist/TextLayerBuilder.css";
import axios from "axios";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default class pdfContainer extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: "Carol",
      numPages: null,
      pageNumber: 1,
      fileName: "",
      file: "",
      uploadInput: "",
      comment: "",
      comments: [],
      files: []
    }
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    await axios.get("http://localhost:5000/api/pdfs/user/" + this.state.username)
      .then(data => data.data)
      .then(res => this.setState({ files: [...this.state.files, ...res[0].pdfs]}));
  }

  async handleSubmit(event) {
    event.preventDefault();
    //call to database and set comments list
    console.log(event.target)
    await axios.post("http://localhost:5000/api/pdfs/comments/", {
      pdfName: this.state.fileName,
      username: this.state.username,
      comment: this.state.comment,
      pageNum: this.state.pageNumber
    }).then(data => console.log(data.data))

  }

  async handleChange(event) {
    // console.log(this.state.files)
    await this.setState({ comment: event.target.value });
  }

  onDocumentLoadSuccess = (document) => {
    const { numPages } = document;
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  changePage = offset => this.setState(prevState => ({
    pageNumber: prevState.pageNumber + offset,
  }));

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  async handleUpload(e) {

    let files = e.target.files
    let file = ""
    let fileName = ""
    let reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      // console.log(e.target.result)
      file = e.target.result
      this.setState({ file: file })
    }
    fileName = files[0].name
    await this.setState({fileName: fileName})
    console.log(files)
    // await this.setState({ files: [...this.state.files, fileName] })
    // console.log(this.state.files)

    await axios.post("http://localhost:5000/api/pdfs/addPDF", {
      pdfName: fileName,
      username: this.state.username,
      pdf: files[0]
    }).then(data => data.data)
    .then(res => this.setState({ files: [...res[0].pdfs]}));
  }

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
      color: 'red',
      textAlign: 'center',
    };

    return (

      <div className='react_fragment' style={divStyle}>
        <React.Fragment style={divStyle}>
          <p style={divStyle}>

            <Document
              file={this.state.file}
              onLoadSuccess={this.onDocumentLoadSuccess}
              style={divStyle}
            >
              <Page size="A1" pageNumber={pageNumber} style={styles.page}   >
                <View style={styles.section}>
                </View>
              </Page>

            </Document>


          </p>
          <div className="commentPanel">
            <p className='pdfPagetext'>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </p>
            <button
              type="button"
              className="btn btn-success"
              disabled={pageNumber <= 1}
              onClick={this.previousPage}
            >
              Previous
          </button>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={this.nextPage}
              className="btn btn-success"
            >
              Next
          </button>

            <form className="comment_form" onSubmit={this.handleSubmit}>
              <label className='pdfPagetext'>
                Comment:
                </label>
              <div>
                <textarea type="text" className="commentText" name="comment" value={this.state.comment} placeholder="Write comment.." onChange={this.handleChange} />
              </div>
              <div>
                <button type="submit" value="Submit" className="btn btn-success" >Save</button>
              </div>

            </form>
            <label>
              Files:
            </label>
            <ul>
              {this.state.files.map(item => (
                <li key={item.pdfName}>{item.pdfName}</li>
              ))}
            </ul>
            <form className="comment_form" onSubmit={this.handleUpload}>
              <input className="form-control" name="file" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleUpload} />
            </form>
          </div>

        </React.Fragment>
      </div>
    );
  }
}
