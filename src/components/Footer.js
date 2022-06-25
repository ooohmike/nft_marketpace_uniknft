import React, { Component } from 'react';
import '../assets/css/footer.css';
import footer_author_big from '../assets/img/footer-author-big.png';
import footer_author from '../assets/img/footer-author.png';
import footer_logo from '../assets/img/new_home/footerNFT.png';
import pop from '../assets/img/pop.png';
import pencil from '../assets/img/pencil.png';
import 'font-awesome/css/font-awesome.min.css';

class Footer extends Component {
    render() {
        return (
            <div className="footer-container font-family-1">
                <div className="footer">
                    <div className="left">
                        <div className="footer-text">
                            <div>SIGN UP FOR EXCLUSIVE RELEASES AND NEWS</div>
                        </div>
                        <div className="center">
                            {/* <div className="image-container">
                                <img className="img-responsive" src={pencil} />
                            </div> */}
                            <div className="subscribe-form">
                                <div className="firstName">
                                    <input type="text" placeholder="FIRST NAME" />
                                </div>
                                <div>
                                    <input type="text" placeholder="ENTER YOUR EMAIL" />
                                </div>
                                <div>
                                    <input type="button" value="SUBSCRIBE" />
                                </div>
                            </div>
                            <div className="social">
                                <div className="footer-logo">
                                    <img src={footer_logo} />
                                </div>
                                <div className="social-links">
                                    <div>
                                        <i className="fa fa-instagram"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-facebook"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-twitter"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-whatsapp"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-youtube-square"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-snapchat"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-app"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-linkedin"></i>
                                    </div>
                                    <div>
                                        <i className="fa fa-pinterest"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="right">
                        <div>
                            <img className="img-responsive" src={footer_author_big} alt="photo 1" />
                        </div>
                        <div>
                            <img className="img-responsive" src={pop} alt="photo 1" />
                        </div>
                        <div>
                            <img className="img-responsive" src={footer_author} alt="photo 1" />
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default Footer;