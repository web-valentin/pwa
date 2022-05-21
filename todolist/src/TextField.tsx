import React, { useRef } from "react";
import { useState } from "react";

interface Person {
    firstName: string;
    lastName: string;
}

interface Props {
    text: string;
    ok: boolean;
    i?: number;
    fn?: (bob:string) => string;
    person: Person;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextField: React.FC<Props> = ({ handleChange }) => {
    const [count, setcount] = useState<number>(5)
    const inputRef = useRef<HTMLInputElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={divRef}>
            <input ref={inputRef} onChange={handleChange}/>
        </div>
    );
}