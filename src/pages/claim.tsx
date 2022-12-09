
import React from 'react'
import { useParams } from 'react-router-dom';
import { decrypt } from '../crypto';

const Claim = () => {
    let { hash } = useParams();

    return (
        <div>Caramelo valido para {decrypt(hash!)}</div>
    )
}

export default Claim