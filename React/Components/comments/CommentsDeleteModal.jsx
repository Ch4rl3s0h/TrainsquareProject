import React, { useState, useEffect } from 'react';
import commentService from '../../services/commentService';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import toastr from '../../utils/toastr';

const _logger = debug.extend('CommentsDeleteModal');

function CommentsDeleteModal(props) {
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

    const onDeleteClicked = (evt) => {
        evt.preventDefault();
        _logger(commentData);
        commentService.remove(commentData.id).then(onDeleteSuccess).catch(onDeleteError);
    };

    const onDeleteSuccess = (response) => {
        _logger(response);
        handleClose();
        toastr.success('Comment successfully deleted');
        window.location.reload();
    };

    const onDeleteError = (error) => {
        _logger('delete was not successful', error);
        toastr.error('Could not delete comment');
    };

    return (
        <React.Fragment>
            <Button variant="primary" className="btn-sm btn-danger rounded-pill" onClick={handleShow}>
                Delete
            </Button>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onDeleteClicked}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

CommentsDeleteModal.propTypes = {
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

export default CommentsDeleteModal;
