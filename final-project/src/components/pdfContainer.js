import React, { Component } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf-reader/dist/TextLayerBuilder.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
let colors = ["#fc605b", "#fdbc40", "#34c84a", "#57acf5"];
let colorsCounter = -1;
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
      comments:[],
      files: []
    }
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  colorReoccur = () =>
  {
    if(colorsCounter > 3)
    {
      colorsCounter = -1;
    }
    console.log(++colorsCounter);
    return colors[colorsCounter];
  }

  handleSubmit(event) {
    event.preventDefault();
    //call to database and set comments list
    console.log(event.target)
  }
  
  async handleChange(event) {
    console.log(event.target.value)
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
    let file= ""
    let fileName = ""
    let reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = (e) => {
      // console.log(e.target.result)
      file = e.target.result
      this.setState({file: file})
    }
    fileName = files[0].name
    console.log(fileName)
    await this.setState({files:[...this.state.files, fileName]  })
    console.log(this.state.files)

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

    if (colorsCounter > 3)
      {
      colorsCounter = -1;
      }

    return (
      <div className="window-content">
        <div className="pane-group">
          <div className="pane pane-one-fourth sidebar" style={{"padding": "1rem"}}>
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
                <textarea type="text" className="commentText" name="comment" value={this.state.comment} placeholder="Write comment.." onChange={this.handleChange}/>
              </div>
              <div>
                <button type="submit" value="Submit" className="btn btn-positive">Save</button>
              </div>

            </form>
            <label>
              Files:
            </label>
            <nav className="nav-group">
              <h5>Recently Opened:</h5>
              
              {this.state.files.map(item => (
                  <span className="nav-group-item" key={item}>
                    <span className="icon icon-record" style={{"color": colors[++colorsCounter]}}></span>
                    {item}
                  </span>
                  ))}  
          </nav>
            <form className="comment_form" onSubmit={this.handleUpload}>
              <input className="form-control" name="file" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleUpload} />
            </form>
          </div>

          <div className="pane">
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



 // <div className='react_fragment' style={divStyle}>
 //   <React.Fragment style={divStyle}>
 //     <p style={divStyle}>

 //       <Document
 //         file={this.state.file}
 //         onLoadSuccess={this.onDocumentLoadSuccess}
 //         style={divStyle}
 //       >
 //         <Page size="A1" pageNumber={pageNumber} style={styles.page}   >
 //           <View style={styles.section}>
 //           </View>
 //         </Page>

 //       </Document>


 //     </p>
 //     <div className="commentPanel">
 //       <p className = 'pdfPagetext'>
 //         Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
 //       </p>
 //       <button
 //         type="button"
 //         className="btn btn-success" 
 //         disabled={pageNumber <= 1}
 //         onClick={this.previousPage}
 //       >
 //         Previous
 //     </button>
 //       <button
 //         type="button"
 //         disabled={pageNumber >= numPages}
 //         onClick={this.nextPage}
 //         className="btn btn-success" 
 //       >
 //         Next
 //     </button>

 //       <form className="comment_form" onSubmit={this.handleSubmit}>
 //         <label className = 'pdfPagetext'>
 //           Comment:
 //           </label>
 //         <div>
 //           <textarea type="text" className="commentText" name="comment" value={this.state.comment} placeholder="Write comment.." onChange={this.handleChange}/>
 //         </div>
 //         <div>
 //           <button type="submit" value="Submit" className="btn btn-success" >Save</button>
 //         </div>

 //       </form>
 //       <label>
 //         Files:
 //       </label>
 //       <ul>
 //         {this.state.files.map(item => (
 //           <li key={item}>{item}</li>
 //         ))}
 //       </ul>
 //       <form className="comment_form" onSubmit={this.handleUpload}>
 //         <input className="form-control" name="file" ref={(ref) => { this.uploadInput = ref; }} type="file" onChange={this.handleUpload} />
 //       </form>
 //     </div>

 //   </React.Fragment>
 // </div>