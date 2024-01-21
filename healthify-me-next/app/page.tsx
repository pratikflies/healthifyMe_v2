import React from "react";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
    return (
        <>
            <div className="sidebar">
                <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    width={500} 
                    height={300} 
                    className="logo"
                />
                <div>
                    <p className="intro">
                        {`You are currently using a demo version of the app. To gain access to the full version, `}
                        <Link href="/login" className="Github Link">Login</Link>{` or `}
                        <Link href="/signup" className="Github Link">Signup</Link>{` or `}.{` In case you are facing problems, `}
                        <Link href="/contact-us" className="Github Link">Contact Us</Link>.
                    </p>
                </div>
                <ul className="workouts">
                    <form className="form hidden">
                        <div className="form__row">
                            <label className="form__label">Type</label>
                            <select className="form__input form__input--type">
                                <option value="running">Running</option>
                                <option value="cycling">Cycling</option>
                            </select>
                        </div>
                        <div className="form__row">
                            <label className="form__label">Distance</label>
                            <input className="form__input form__input--distance" placeholder="km" />
                        </div>
                        <div className="form__row">
                            <label className="form__label">Duration</label>
                            <input
                                className="form__input form__input--duration"
                                placeholder="min"
                            />
                        </div>

                        <div className="form__row">
                            <label className="form__label">Cadence</label>
                            <input
                                className="form__input form__input--cadence"
                                placeholder="step/min"
                            />
                        </div>
                        <div className="form__row form__row--hidden">
                            <label className="form__label">Elev Gain</label>
                            <input
                                className="form__input form__input--elevation"
                                placeholder="meters"
                            />
                        </div>
                        <button className="form__btn">OK</button>
                    </form>
                </ul>

                <p className="copyright">
                    {`Your personal fitness tracking app built by `}
                    <a
                        className="Github Link"
                        target="_blank"
                        href="https://github.com/SauravM307"
                        >Saurav</a>
                    {` and `}
                    <a
                        className="Github Link"
                        target="_blank"
                        href="https://github.com/pratikflies"
                        >Pratik</a>.
                </p>
            </div>

            <div id="map"></div>

            {/* Include Leaflet JS */}
            {/* Be aware that including scripts like this is not the standard React way */}
            {/* It's better to use a React-friendly library or hooks for external scripts */}
            {/* <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"></script> */}
            {/* <script src="../homepageScript.js"></script> */}
        </>
    );
};

export default Page;
