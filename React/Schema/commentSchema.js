import * as Yup from 'yup';

const commentsSchema = Yup.object().shape({
    subject: Yup.string().min(2).max(100),
    text: Yup.string().min(2).max(3000).required('Comment required'),
});

export default commentsSchema;
