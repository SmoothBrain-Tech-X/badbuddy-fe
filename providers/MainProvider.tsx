import React from 'react';
import Navbar from '@/components/layout/Navbar';

type Props = {
    children: React.ReactNode;
};

const MainProvider = (props: Props) => (
    <div>
        <div style={{
            height: '84px',
        }}>
            <Navbar />
        </div>
        {props.children}
    </div>
);

export default MainProvider;
