import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
  Breadcrumb,
  BreadcrumbItem,Modal,ModalBody,ModalHeader,Label
} from "reactstrap";
import{Link} from 'react-router-dom';
import{LocalForm,Control,Errors} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderDish({ dish,isLoading,errMess}) {
  if(isLoading){
    return(
      <div className="container">
        <div className="row">
          <Loading/>
        </div>
      </div>
    );
  }
  else if(errMess){
    return(
      <div className="container">
        <div className="row">
          <h4>{errMess}</h4>
        </div>
      </div>
    );
  }
  else
    if (dish != null) {
      return (
        <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
          <div className="col-md-5 col-12 m-1">
            <Card>
              <CardImg width="100%" src={baseUrl+dish.image} />
              <CardBody>
                <CardTitle> {dish.name} </CardTitle>
                <CardText> {dish.description} </CardText>
              </CardBody>
            </Card>
          </div>
          </FadeTransform>
      );
    } else {
      return <div> </div>;
    }
}

function RenderComments({comments, postComment, dishId}) {
  if (comments != null) {
    return (
      
      <div className="col-md-5 col-12 m-1">
        <h4> Comments </h4>
        <ul className="list-unstyled">
        <Stagger in>
          {comments.map((comment) => {
            return (
              <Fade in>
                <li key={comment.id}>
                  <p> {comment.comment} </p>
                  <p>
                    --{comment.author},
                    {new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }).format(new Date(Date.parse(comment.date)))}
                  </p>
                </li>
              </Fade>
                
            );
          })}
        </Stagger>
        </ul>
        <CommentForm dishId={dishId} postComment={postComment} />
      </div>
    );
  } else {
    return <div></div>;
  }
}
class CommentForm extends Component{
  constructor(props){
    super(props);
    this.state={
      isModOpen:false
    }
    this.toggleMod=this.toggleMod.bind(this);
  }
  toggleMod(){
    this.setState({
      isModOpen: !this.state.isModOpen,
      
    });
    console.log("enter in togglemodel");
  }
  handleSubmit(values){
    
    this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
  }
  render(){
    return(
      <div>
        <Modal isOpen={this.state.isModOpen} toggle={this.toggleMod}>
          <ModalHeader toggle={this.toggleMod}>Submit Comment</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values)=>this.handleSubmit(values)}>
              <div className="form-group">
                <Label htmlFor="rating">Rating</Label>
                <div>
                  <Control.select model=".rating" id="rating" name="rating" className="form-control">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Control.select>
                </div>
              </div>
              <div className="form-group">
                <Label htmlFor="author" >Your Name</Label>
                <div>
                  <Control.text model=".author" id="author" name="author" className="form-control" 
                  validators={{required, minLength: minLength(3), maxLength: maxLength(15)}}/>
                  <Errors
                     className="text-danger"
                     model=".author"
                     show="touched"
                     messages={{
                         required: 'Required',
                         minLength: ' Must be greater than 2 characters',
                         maxLength: ' Must be 15 characters or less'
                     }}
                  />
                </div>
              </div>
              <div className="form-group">
                <Label htmlFor="comment">Comment</Label>
                <div>
                  <Control.textarea rows="6" model=".comment" id="comment" name="comment" className="form-control" />
                </div>
              </div>
              <button type="submit" className="bg-primary">Submit</button>
            </LocalForm>
          </ModalBody>
        </Modal>
        <button onClick={this.toggleMod} type="button" className="text-secondary"><span className="fa fa-pencil fa-lg"> Submit Comment</span></button>
        
      </div>
    );
  }
}

const DishDetail = (props) => {
  return (
    
    <div className="container">
        <div className="row">
            <Breadcrumb>
                <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem> 
            </Breadcrumb>
            <div className="col-12">
                <h3>{props.dish.name}</h3>
                <hr/>
            </div>
        </div>
      <div className="row">
          <RenderDish dish={props.dish} isLoading={props.isLoading} errMess={props.errMess} /> 
          <RenderComments comments={props.comments} 
          postComment={props.postComment}
          dishId={props.dish.id}/>
      </div>
    </div>
  );
};

export default DishDetail;
