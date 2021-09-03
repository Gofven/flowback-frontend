/**
 * FlowBack was created and project lead by Loke Hagberg. The design was
 * made by Lina Forsberg. Emilio Müller helped constructing Flowback.
 * Astroneatech created the code. It was primarily financed by David
 * Madsen. It is a decision making platform.
 * Copyright (C) 2021  Astroneatech AB
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
*/

import React, { useEffect, useState } from 'react';

/**
 * Common image component to show default image if original image could not be loaded due to any error
 * @param {*} props 
 * @returns 
 */
export default function Image(props) {

    const [src, setSrc] = useState('');
    const { errImg, ...otherProps } = props;
    const onError = () => {
        console.log('on errr', src, props.className);
        if (props.errImg) {
            setSrc(props.errImg);
        } else if (!props.noDefaultImg) {
            setSrc('/img/flower.jpg');
        }
    }

    useEffect(() => {
        if (props.src instanceof File) {
            var reader = new FileReader();
            reader.readAsDataURL(props.src);

            reader.onloadend = () => {
                setSrc(reader.result);
            }
        } else {
            if (props.src) {
                setSrc(props.src);
            } else {
                onError();
            }
        }
    }, [props.src])
    return (
        <>
            <img key={props.src} {...otherProps} src={src} alt={props.alt} onError={() => onError()} />
        </>
    );
}