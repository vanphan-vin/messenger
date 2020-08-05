import React, { Component } from "react";

class Spinner extends Component {
    render() {
        return (
            <div className="loader">
                <div className="loader-inner one"></div>
                <div className="loader-inner two"></div>
                <div className="loader-inner three"></div>
            </div>
        );
    }
}

export default Spinner;
