const Loader = ({text} : {text: string}) => {

    return (
        <div className="mt-0 mb-5 w-full h-full flex flex-col justify-center items-center">
            <div className="
            w-[60px] h-[60px] border-r-4 border-white rounded-full my-4 animate-spin preloader"></div>
            <p className="text-white text-opacity-65 text-center mt-5 pt-5 h-full noselect">
                {text}
            </p>
        </div>
    )
}

export default Loader