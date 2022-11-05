import { createContext, SetStateAction, useContext } from "react";
import { BsFillPeopleFill, BsPeople } from "react-icons/bs";

type PrivateContextType = {privateAccessable: boolean, setPrivate: React.Dispatch<SetStateAction<boolean>>};

export const PrivateContext = createContext<PrivateContextType>({privateAccessable: false, setPrivate: () => {}});

const PrivateToggle = () => {
    const {privateAccessable, setPrivate} = useContext(PrivateContext);
    return (
        <button
            onClick={() => { setPrivate(!privateAccessable) }}
        >
            {privateAccessable ? <BsFillPeopleFill className="inline-block text-2xl"/> : <BsPeople className="inline-block text-2xl"/>}
        </button>
    )
};

export default PrivateToggle;