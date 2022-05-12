import React from 'react';
import PropTypes from 'prop-types';
import debug from 'sabio-debug';
import CommentsUpdateModal from './CommentsUpdateModal';
import CommentsReplyModal from './CommentsReplyModal';
import CommentsDeleteModal from '../comments/CommentsDeleteModal';

const _logger = debug.extend('CommentTemplate');

function CommentTemplate(props) {
    _logger(props, PropTypes);
    const aComment = props?.comment;

    return (
        <>
            <div className="row mt-2">
                <div className="col6">
                    <div
                        className="card"
                        style={{ width: 500, boxShadow: '0px 0px 35px 0px rgba(154, 161, 171, 0.15)' }}>
                        <div className="card-header rounded pb-0">
                            <h3 className="text-primary">
                                <img
                                    className="rounded-circle img-thumbnail avatar-sm"
                                    alt="100x100"
                                    src={aComment.avatarUrl}
                                    data-holder-rendered="true"></img>
                                {`${aComment.firstName} ${aComment.lastName}`}
                            </h3>
                            <div className="card-body pt-1">
                                <div className="h4 ml-3 mb-3 mt-0">{aComment?.subject}</div>
                                <h4 className="card-text text-muted font-16 mb-3">{aComment?.text}</h4>
                                <CommentsUpdateModal currentComment={aComment}></CommentsUpdateModal>
                                <CommentsDeleteModal currentComment={aComment}></CommentsDeleteModal>
                                <div className="card-body mt-0 pb-0">
                                    <CommentsReplyModal currentComment={aComment}></CommentsReplyModal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col"></div>
                <div className="col-7">
                    {aComment.replies &&
                        aComment.replies.map((reply) => (
                            <CommentTemplate comment={reply} key={'ListCommentReply' + reply.id}></CommentTemplate>
                        ))}
                </div>
                <div className="col"></div>
            </div>
        </>
    );
}

CommentTemplate.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        subject: PropTypes.string,
        text: PropTypes.string.isRequired,
        parentId: PropTypes.number,
        entityType: PropTypes.number.isRequired,
        entityId: PropTypes.number.isRequired,
        isDeleted: PropTypes.bool.isRequired,
        replies: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                subject: PropTypes.string,
                text: PropTypes.string.isRequired,
                parentId: PropTypes.number,
                entityType: PropTypes.number.isRequired,
                entityId: PropTypes.number.isRequired,
                isDeleted: PropTypes.bool.isRequired,
            })
        ),
    }),
    onCommentClicked: PropTypes.func.isRequired,
    setCurrentComment: PropTypes.func.isRequired,
    setShowModal: PropTypes.func.isRequired,
};

export default CommentTemplate;
