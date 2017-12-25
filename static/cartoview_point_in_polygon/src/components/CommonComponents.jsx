import {DefaultModalStyle} from '../constants/constants.jsx'
import Modal from 'react-modal'
import PropTypes from 'prop-types'
import React from 'react'
export const Loader = (props) => {
    return <div className="flex-element flex-center">
        <div className="loading"></div>
    </div>
}
Loader.propTypes = {

}
export const NextButton = (props) => {
    const { clickAction, disabled, message } = props
    return <button disabled={disabled} className={`btn btn-primary btn-sm pull-right next-button`} onClick={() => clickAction()}>
        {`${typeof (message) != "undefined" ? message : "Next"}`} <i className="fa fa-chevron-right" aria-hidden="true"></i>
    </button>
}
NextButton.propTypes = {
    clickAction: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
    message: PropTypes.string
}
export const Tip=(props)=> {
    const {text}=props
    return (
      <div className="panel panel-info tip" >
        <div className="panel-heading">{"Tip:"}</div>

        <div className="panel-body">
          {text}
        </div>
      </div>
    )
}
Tip.propTypes={
    text:PropTypes.string.isRequired
}
export const PreviousButton = (props) => {
    const { clickAction, disabled } = props
    return <button disabled={disabled} className={`btn btn-primary btn-sm pull-right next-button`} onClick={() => clickAction()}>
        <i className="fa fa-chevron-left" aria-hidden="true"></i> {"Back"}
    </button>
}
PreviousButton.propTypes = {
    clickAction: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
}
export const ErrorModal=(props)=> {
    const {open,onRequestClose,error}=props
    return (
        <Modal className="modal-dialog" isOpen={open} style={DefaultModalStyle} onRequestClose={onRequestClose}>
            <div className="">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="row">
                            <div className="col-xs-6 col-md-6">
                                <h3>Error</h3>
                            </div>
                            <div className="col-xs-1 col-md-1 col-md-offset-5 col-xs-offset-5">
                                <div className="pull-right">
                                    <a className="btn btn btn-primary" onClick={(e) => {
                                        e.preventDefault()
                                        onRequestClose()
                                    }}><i className="fa fa-times" aria-hidden="true"></i>                                        </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        <div className="row">
                            <div className="col-md-12 text-center text-danger">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
ErrorModal.propTypes={
    error:PropTypes.string.isRequired,
    onRequestClose:PropTypes.func.isRequired,
    open:PropTypes.bool.isRequired
}