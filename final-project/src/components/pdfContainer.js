import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf-reader/dist/TextLayerBuilder.css";
import axios from "axios";
import Header from './header';
import firebase from 'firebase';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default class pdfContainer extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: "",
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
    firebase.auth().onAuthStateChanged(this.onAuthChage.bind(this));

  }

  async onAuthChage(user) {
    let username = ""
    if (user) {
      if (user.displayName) {
        username = user.displayName
      } else {
        username = user.email
        username = username.substring(0, username.indexOf('@'));
      }
    }

    await this.setState({ username: username })
  }

  async componentDidMount() {

    await firebase.auth().onAuthStateChanged(this.onAuthChage.bind(this));

    await axios.get("http://localhost:5000/api/pdfs/user/" + this.state.username)
      .then(data => data.data)
      .then(res => res[0] ? this.setState({ files: [...this.state.files, ...res[0].pdfs] }) : this.setState({ files: [] }));
  }

  async handleSubmit(event) {
    event.preventDefault();

    await axios.post("http://localhost:5000/api/pdfs/comments/", {
      pdfName: this.state.fileName,
      username: this.state.username,
      comment: this.state.comment,
      pageNum: this.state.pageNumber
    }).then(data => data.data)

    await axios.get("http://localhost:5000/api/pdfs/comments/" + this.state.username + "/" + this.state.fileName)
      .then(data => data.data)
      .then(res => this.setState({ comments: [...res] }));

    let i = 0;
    for (i in this.state.comments) {
      if (this.state.comments[i].pageNum == this.state.pageNumber) {
        this.setState({ comment: this.state.comments[i].comment })
      }
    }
  }

  async handleChange(event) {

    await this.setState({ comment: event.target.value });
  }

  onDocumentLoadSuccess = (document) => {

    const { numPages } = document;
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  changePage(offset) {

    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + offset,
    }));

    let i = 0;
    for (i in this.state.comments) {
      if (this.state.comments[i].pageNum == this.state.pageNumber + offset) {
        this.setState({ comment: this.state.comments[i].comment })
        break
      } else {
        this.setState({ comment: "" })
      }
    }
  }

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  async handleUpload(e) {

    let files = e.target.files
    let file = ""
    let fileName = ""
    let reader = new FileReader()

    if (files[0] !== undefined) {

      reader.readAsDataURL(files[0])
      reader.onload = (e) => {
        file = e.target.result
        this.setState({ file: file })
      }

      fileName = files[0].name

      await this.setState({ fileName: fileName })

      if (this.state.files.find(function (elem) { return elem.pdfName == fileName })) {
        await this.setState({ comments: []})
        await this.setState({ comment: "" })
        await axios.get("http://localhost:5000/api/pdfs/comments/" + this.state.username + "/" + fileName)
          .then(data => data.data)
          .then(res => this.setState({ comments: [...res] }));
        let i = 0;
        for (i in this.state.comments) {
          if (this.state.comments[i].pageNum == this.state.pageNumber) {
            this.setState({ comment: this.state.comments[i].comment })
          }
        }
      } else {
        await this.setState({ comments: []})
        await this.setState({ comment: "" })
        await axios.post("http://localhost:5000/api/pdfs/addPDF", {
          pdfName: fileName,
          username: this.state.username
        }).then(data => data.data)
          .then(res => this.setState({ files: [...res[0].pdfs] }));
      }
    }
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
      <div>
        <div className="pane-group" style={{ "margin": "2.5rem" }}>
          <div className="pane pane-one-fourth sidebar" style={{ "padding": "1rem", "margin": "2.5rem", "width": "auto" }}>
            <h3>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </h3>
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
              <h3>
                Comment:
                </h3>
              <div>
                <textarea type="text" className="commentText" name="comment" value={this.state.comment} placeholder="Add a Comment..." onChange={this.handleChange}></textarea>
              </div>
              <div>
                <button type="submit" value="Submit" className="btn btn-positive">Save</button>
              </div>

            </form>
            <nav className="nav-group">
              <h5>Already Uploaded:</h5>

              {this.state.files.map(item => (
                <span className="nav-group-item" key={item.pdfName}>
                  <span className="icon icon-record"></span>
                  {item.pdfName}
                </span>
              ))}
            </nav>
            <form className="comment_form" onSubmit={this.handleUpload}>
              <input className="form-control" name="file" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleUpload} />
            </form>
          </div>

          <div className="pane" style={{ "padding": "1rem", "margin": "2.5rem" }}>
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
          </div>
        </div>
      </div>
    );
  }
}
