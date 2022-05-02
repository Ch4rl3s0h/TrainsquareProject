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

function UpdateComment(props) {
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
        _logger('Update Modal ->', props);
        setCommentInfo(props.currentComment);
    }, []);

    const setCommentInfo = (comments) => {
        const data = {
            id: comments.id,
            subject: comments.subject,
            text: comments.text,
            parentId: comments.parentId,
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

    const onUpdateClicked = (evt) => {
        evt.preventDefault();
        _logger(commentData);
        commentService.update(commentData).then(onUpdateCommentSuccess).catch(onUpdateCommentError);
    };

    const onUpdateCommentSuccess = (response) => {
        _logger(response);
        handleClose();
        toastr.success('Comment successfully updated!');
        window.location.reload();
    };

    const onUpdateCommentError = (error) => {
        _logger(error);
        toastr.error('Comment could not be updated');
    };

    return (
        <React.Fragment>
            <Formik
                enableReinitialize={true}
                initialValues={commentData}
                onSubmit={onUpdateClicked}
                validationSchema={commentsSchema}>
                <Form>
                    <Modal show={show} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Comment</Modal.Title>
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
                                value={commentData.subject}
                                onChange={onFormChange}
                            />
                            <label htmlFor="text" className="form-label">
                                Comment
                            </label>
                            <Field
                                type="text"
                                className="form-control"
                                id="text"
                                name="text"
                                value={commentData.text}
                                onChange={onFormChange}
                            />
                            <ErrorMessage name="text" component="div" className="has-error" />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={onUpdateClicked}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Form>
            </Formik>
            <Button variant="primary" className="btn-sm rounded-pill" onClick={handleShow}>
                Edit
            </Button>
        </React.Fragment>
    );
}

UpdateComment.propTypes = {
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

export default UpdateComment;
