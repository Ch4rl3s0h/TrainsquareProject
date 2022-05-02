import React, { useEffect, useState } from 'react';
import debug from 'sabio-debug';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import commentService from '../../services/commentService';
import CommentTemplate from './CommentTemplate';
import commentsSchema from '../../schema/commentSchema';
import CommentsUpdateModal from '../comments/CommentsUpdateModal';
import CommentsDeleteModal from '../comments/CommentsDeleteModal';
import CommentsReplyModal from '../comments/CommentsReplyModal';
import toastr from '../../utils/toastr';
import locale from 'rc-pagination/lib/locale/en_US';
import Pagination from 'rc-pagination';

const _logger = debug.extend('Comments');

function Comments() {
    const [showModal, setShowModal] = useState(false);

    const [commentsData, setCommentsData] = useState({
        subject: '',
        text: '',
        parentId: '',
        entityTypeId: '',
        entityId: '',
        isDeleted: false,
        arrayOfComments: [],
        commentComponents: [],
    });

    const [pageData, setPageData] = useState({
        pageIndex: 0,
        current: 1,
        pageSize: 5,
        totalCount: 0,
        totalPages: 0,
    });

    const [currentComment, setCurrentComment] = useState();

    const mapComments = (aComment) => (
        <CommentTemplate
            comment={aComment}
            key={'ListComment' + aComment.id}
            setShowModal={setShowModal}
            setCurrentComment={setCurrentComment}></CommentTemplate>
    );

    useEffect(() => {
        _logger('useEffect firing');
        commentService
            .paginate(pageData.pageIndex, pageData.pageSize)
            .then(onRetrieveCommentsSuccess)
            .catch(onRetrieveCommentsError);
    }, []);

    const onRetrieveCommentsSuccess = (data) => {
        _logger(data);
        let arrayOfComms = data.item.pagedItems;
        const commentCount = data.item.totalCount;
        const commentPages = data.item.totalPages;
        const current = data.item.pageIndex + 1;
        _logger(arrayOfComms, commentCount, commentPages);

        setCommentsData((prevState) => {
            const commentsData = { ...prevState };
            commentsData.arrayOfComments = arrayOfComms;
            commentsData.commentComponents = arrayOfComms.map(mapComments);
            return commentsData;
        });

        setPageData((prevState) => {
            const pageData = { ...prevState };
            pageData.totalCount = commentCount;
            pageData.totalPages = commentPages;
            pageData.current = current;
            _logger(pageData);
            return pageData;
        });
    };

    const pageChange = (page) => {
        commentService
            .paginate(page - 1, pageData.pageSize)
            .then(onRetrieveCommentsSuccess)
            .catch(onRetrieveCommentsError);
    };

    const onRetrieveCommentsError = (error) => {
        _logger(error);
    };

    const onPostClicked = (values) => {
        _logger('Values', values);
        parseInt(values.parentId);
        parseInt(values.entityTypeId);
        parseInt(values.entityId);
        commentService.add(values).then(onAddCommentSuccess).catch(onAddCommentError);
    };

    const onAddCommentSuccess = (response) => {
        _logger(response);
        toastr.success('Comment added successfully');
        commentService
            .paginate(pageData.pageIndex, pageData.pageSize)
            .then(onRetrieveCommentsSuccess)
            .catch(onRetrieveCommentsError);
    };

    const onAddCommentError = (error) => {
        _logger('error inserting comment', error);
        toastr.error('Comment could not be added');
    };

    return (
        <React.Fragment>
            <div className="row">
                <div className="col"></div>
                <div className="col-6">
                    <div className="form-group">
                        <Formik
                            enableReinitialize={true}
                            initialValues={commentsData}
                            onSubmit={onPostClicked}
                            validationSchema={commentsSchema}>
                            <Form>
                                <label className="mb-1" foreach="exampleFormControlTextarea1">
                                    Add a Comment
                                </label>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject </label>
                                        <small id="subjectLine" className="form-text text-muted">
                                            (if applicable)
                                        </small>
                                        <Field type="text" name="subject" className="form-control" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-group">
                                        <label htmlFor="text">Comment</label>
                                        <Field component="textarea" type="text" name="text" className="form-control" />
                                        <ErrorMessage name="text" component="div" className="has-error" />
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="btn-rounded btn btn-primary mb-2">
                                        Post Comment
                                    </button>
                                </div>
                                {showModal && (
                                    <CommentsUpdateModal currentComment={currentComment}></CommentsUpdateModal>
                                )}
                                {showModal && (
                                    <CommentsDeleteModal currentComment={currentComment}></CommentsDeleteModal>
                                )}
                                {showModal && <CommentsReplyModal currentComment={currentComment}></CommentsReplyModal>}
                            </Form>
                        </Formik>
                    </div>
                </div>
                <div className="col"></div>
            </div>
            <div className="row">
                <div className="col"></div>
                <div className="col-6">
                    <Pagination
                        onChange={pageChange}
                        pageSize={pageData.pageSize}
                        current={pageData.current}
                        total={pageData.totalCount}
                        locale={locale}
                        aria-label="Previous"
                    />
                    <div>{commentsData?.commentComponents}</div>
                    <Pagination
                        onChange={pageChange}
                        pageSize={pageData.pageSize}
                        current={pageData.current}
                        total={pageData.totalCount}
                        locale={locale}
                        aria-label="Next"
                    />
                </div>
                <div className="col"></div>
            </div>
        </React.Fragment>
    );
}

export default Comments;
