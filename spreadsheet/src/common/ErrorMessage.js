/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { SEARCH_NOT_FOUNT_ERROR } from "./ErrorConstants";

const ErrorMessage = (props) => {
    const [status, setStatus] = useState(props.status);
    useEffect(() => {
        setStatus(props.status);
    }, [props.status]);
    if (status === "invalid") {
        return (
            <div id="errorMsg">
                <div className="alert alert-danger" role="alert">
                    {SEARCH_NOT_FOUNT_ERROR}
                </div>
                <div className="notification-close">
                    <FontAwesomeIcon
                        icon={faTimes}
                        onClick={() => {
                            props.closeWarningStatus();
                            props.clearSearchValue();
                        }}
                    />
                </div>
            </div>
        );
    }
    return <div />;
};
export default ErrorMessage;
