import plusIcon from './../../assets/icons/plus.svg';
import './FAQ.scss';

export const FAQ = () => {
    return (
        <div className="faq flex flex-col gap-32">
            <div className="faq__header flex items-center justify-center">
                <h3 className="faq__title">FAQ</h3>
            </div>
            <div className="faq__content flex flex-col">
                <div className="faq__row">
                    <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            How do I create a package listing?
                        </span>
                        <button className="faq__rowIcon">
                            <img src={plusIcon} alt="Plus Icon"/>
                        </button>
                    </div>
                </div>
                <div className="faq__row">
                    <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            What happens if my package isn't delivered?
                        </span>
                        <button className="faq__rowIcon">
                            <img src={plusIcon} alt="Plus Icon"/>
                        </button>
                    </div>
                </div>
                <div className="faq__row">
                    <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            How does UGOGO ensure user safety?
                        </span>
                        <button className="faq__rowIcon">
                            <img src={plusIcon} alt="Plus Icon"/>
                        </button>
                    </div>
                </div>
                <div className="faq__row">
                    <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            Are there restrictions on what I can ship?
                        </span>
                        <button className="faq__rowIcon">
                            <img src={plusIcon} alt="Plus Icon"/>
                        </button>
                    </div>
                </div>
                <div className="faq__row">
                    <div className="faq__rowQuestion flex items-center justify-between">
                        <span className="faq__rowText">
                            Where is UGOGO available?
                        </span>
                        <button className="faq__rowIcon">
                            <img src={plusIcon} alt="Plus Icon"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}