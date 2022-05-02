import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import commentsSchema from '../../schema/commentSchema';
import commentService from '../../services/commentService';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import toastr from '../../utils/toastr';

const _logger = debug.extend('CommentsUpdateModal');

function CommentReply(props) {
    _logger(props);

    const [commentData, setCommentData] = useState({
        subject: '',
        text: '',
        parentId: '',
        entityType: '',
        entityId: '',
        isDeleted: false,
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        _logger('Reply Modal', props);
        setCommentInfo(props.currentComment);
    }, []);

    const setCommentInfo = (comments) => {
        const data = {
            id: '',
            subject: '',
            text: '',
            parentId: comments.id,
            entityTypeId: comments.entityType,
            entityId: comments.entityId,
            isDeleted: comments.isDeleted,
        };
        setCommentData(data);
    };

    const onFormChange = (e) => {
        _logger('onChange', { syntheticEvent: e });

        const target = e.target;
        const newCommentValue = target.value;
        const nameOfField = target.name;

        setCommentData((prevState) => {
            const newCommentObject = {
                ...prevState,
            };

            newCommentObject[nameOfField] = newCommentValue;

            return newCommentObject;
        });
    };

    const onAddReplyClicked = (evt) => {
        evt.preventDefault();
        _logger(commentData);
        commentService.add(commentData).then(onAddReplySuccess).catch(onAddReplyError);
    };

    const onAddReplySuccess = (response) => {
        _logger(response);
        handleClose();
        toastr.success('Reply successfully added!');
        window.location.reload();
    };

    const onAddReplyError = (error) => {
        _logger(error);
        toastr.error('Reply could not be added');
    };

    return (
        <React.Fragment>
            <Formik
                enableReinitialize={true}
                initialValues={commentData}
                onSubmit={onAddReplyClicked}
                validationSchema={commentsSchema}>
                <Form>
                    <Modal show={show} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Enter Reply</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label htmlFor="subject" className="form-label">
                                Subject
                            </label>
                            <Field
                                type="text"
                                className="form-control"
                                id="subject"
                                name="subject"
                                onChange={onFormChange}
                            />
                            <label htmlFor="text" className="form-label">
                                Comment
                            </label>
                            <Field type="text" className="form-control" id="text" name="text" onChange={onFormChange} />
                            <ErrorMessage name="text" component="div" className="has-error" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={onAddReplyClicked}>
                                Post Reply
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form>
            </Formik>
            <a href="#" variant="primary" className="card-link" onClick={handleShow}>
                Reply
            </a>
        </React.Fragment>
    );
}

CommentReply.propTypes = {
    currentComment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        subject: PropTypes.string,
        text: PropTypes.string.isRequired,
        parentId: PropTypes.number,
        entityType: PropTypes.number.isRequired,
        entityId: PropTypes.number.isRequired,
        isDeleted: PropTypes.bool.isRequired,
    }),
};

export default CommentReply;
