import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FavoriteWorkshops from '../favoriteWorkshops/FavoriteWorkshops';
// import debug from 'sabio-debug';

const WorkShopTemp = (props) => {
    // const _logger = debug.extend('Favorites');
    const navigate = useNavigate();
    const workshop = props.workshopData;

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSessionClick = () => {
        const stateForTransport = {
            type: 'View_Sessions',
            payload: workshop,
        };
        navigate(`/workshops/${workshop.id}/sessions`, { state: stateForTransport });
    };

    return (
        <React.Fragment>
            <div className="mb-3" style={{ width: '16rem' }}>
                <img src={workshop.imageUrl} onClick={handleShow} alt="" className="img-fluid rounded-corners" />
                <h4>{workshop.name}</h4>
                <p className="card-text">{`${workshop.shortDescription.slice(0, 55)}...`}</p>
            </div>
            <Modal show={show} onHide={handleClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{workshop.name}</Modal.Title>
                    <FavoriteWorkshops data={workshop.id}></FavoriteWorkshops>
                </Modal.Header>
                <Modal.Body>
                    <div>{workshop.shortDescription}</div>
                    <button className="btn btn-sm btn-primary mt-2" onClick={onSessionClick}>
                        View All Sessions
                    </button>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            navigate('/workshops/details', { state: { type: 'workshop', payload: workshop } });
                        }}>
                        Add Comment
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

WorkShopTemp.propTypes = {
    workshopData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        summary: PropTypes.string,
        shortDescription: PropTypes.string,
    }),
};

export default WorkShopTemp;
