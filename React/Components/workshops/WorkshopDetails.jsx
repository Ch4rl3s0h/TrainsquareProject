import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CommentsByEntity from '../comments/CommentsByEntity';
import logger from 'sabio-debug';
import './work-shop.css';
const _logger = logger.extend('Workshop Details');

const WorkshopDetails = () => {
    const [workshopData, setWorkshopData] = useState({
        workshop: {
            id: 0,
            name: '',
            summary: '',
            shortDescription: '',
            venueId: 0,
            workShopTypeId: 0,
            workShopStatusId: 0,
            imageUrl: '',
            externalSiteUrl: '',
            languageId: 0,
            isFree: true,
            numberOfSessions: 0,
            dateStart: new Date(),
            dateEnd: new Date(),
            entityTypeId: 9,
        },
    });

    const entityTypeId = 9;

    const location = useLocation();

    const [show, setShow] = useState(false);
    _logger(workshopData);

    const workshopFromLocation = () => {
        setWorkshopData((prevState) => {
            _logger(prevState);
            return { ...prevState.workshop, workshop: location.state.payload };
        });
    };

    useEffect(() => {
        if (location.state && location.state.type === 'workshop') {
            workshopFromLocation();
        }
    }, []);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col"></div>
                <div className="mb-3 col-6" style={{ width: '25rem' }}>
                    <img src={workshopData.workshop?.imageUrl} alt="" className="img-fluid rounded-corners" />
                    <h4>{workshopData.workshop?.name}</h4>
                    <p className="card-text">
                        {show
                            ? workshopData.workshop?.shortDescription
                            : `${workshopData.workshop?.shortDescription?.slice(0, 55)}...`}
                        <strong
                            className="view-more"
                            onClick={() => {
                                setShow(!show);
                            }}>
                            view more
                        </strong>
                    </p>
                </div>
                <div className="col"></div>
            </div>
            {workshopData.workshop.id >= 1 ? (
                <CommentsByEntity entity={workshopData.workshop} entityTypeId={entityTypeId} />
            ) : (
                <CommentsByEntity />
            )}
        </React.Fragment>
    );
};

export default WorkshopDetails;
