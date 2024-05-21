import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom"
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { Dropdown } from '@mui/base/Dropdown';
import { styled } from '@mui/system';
import { CssTransition } from '@mui/base/Transitions';
import { PopupContext } from '@mui/base/Unstable_Popup';
import { Header } from '../layouts/Header';

const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#99CCF3',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E6',
    700: '#0059B3',
    800: '#004C99',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Listbox = styled('ul')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    
    padding: 6px;
    margin: 12px 0;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
    z-index: 1;
  
    .closed & {
      opacity: 0;
      transform: scale(0.95, 0.8);
      transition: opacity 200ms ease-in, transform 200ms ease-in;
    }
    
    .open & {
      opacity: 1;
      transform: scale(1, 1);
      transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
    }
  
    .placement-top & {
      transform-origin: bottom;
    }
  
    .placement-bottom & {
      transform-origin: top;
    }
    `,
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox(props, ref) {
    const { ownerState, ...other } = props;
    const popupContext = React.useContext(PopupContext);

    if (popupContext == null) {
        throw new Error(
            'The `AnimatedListbox` component cannot be rendered outside a `Popup` component',
        );
    }

    const verticalPlacement = popupContext.placement.split('-')[0];

    return (
        <CssTransition
            className={`placement-${verticalPlacement}`}
            enterClassName="open"
            exitClassName="closed"
        >
            <Listbox {...other} ref={ref} />
        </CssTransition>
    );
});

AnimatedListbox.propTypes = {
    ownerState: PropTypes.object.isRequired,
};

const MenuItem = styled(BaseMenuItem)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &:focus {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    &.${menuItemClasses.disabled} {
      color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
    `,
);

const MenuButton = styled(BaseMenuButton)(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: white !important;
    transition: all 150ms ease;
    cursor: pointer;
    background: transparent;
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    `,
);

export function Main() {
    return (
        <div className="w-[100%] bg-[#21222D]">
            <div className="h-full flex flex-col">
                <Header />
                <div className="flex-growp-10 p-20">
                    <p className="text-white text-2xl">Recent Projects</p>
                    <div className="flex mt-5">
                        <Link>
                            <div className='h-[325px] bg-[#262732] hover:bg-[#6e707f] rounded-xl flex flex-col mr-10'>
                                <div className='relative'>
                                    <img src='/img/recent/img1.png' className='rounded-tl-xl rounded-tr-xl'></img>
                                    <div className='w-[52px] h-[52px] bg-white rounded-lg absolute bottom-[-26px] ml-5 flex justify-center items-center'>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25 28.5C26.5913 28.5 28.1174 27.8679 29.2426 26.7426C30.3679 25.6174 31 24.0913 31 22.5C31 20.9087 30.3679 19.3826 29.2426 18.2574C28.1174 17.1321 26.5913 16.5 25 16.5C24.4696 16.5 23.9609 16.7107 23.5858 17.0858C23.2107 17.4609 23 17.9696 23 18.5V26.5C23 27.0304 23.2107 27.5391 23.5858 27.9142C23.9609 28.2893 24.4696 28.5 25 28.5Z" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M7 28.5C5.4087 28.5 3.88258 27.8679 2.75736 26.7426C1.63214 25.6174 1 24.0913 1 22.5C1 20.9087 1.63214 19.3826 2.75736 18.2574C3.88258 17.1321 5.4087 16.5 7 16.5C7.53043 16.5 8.03914 16.7107 8.41421 17.0858C8.78929 17.4609 9 17.9696 9 18.5V26.5C9 27.0304 8.78929 27.5391 8.41421 27.9142C8.03914 28.2893 7.53043 28.5 7 28.5Z" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M5 16.8413V14.5C5.00844 11.5852 6.17008 8.79222 8.23115 6.73115C10.2922 4.67008 13.0852 3.50844 16 3.5C18.9148 3.50844 21.7078 4.67008 23.7688 6.73115C25.8299 8.79222 26.9916 11.5852 27 14.5V16.8413" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M16 28.166V30.2493" stroke="#EB8D38" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15.7222 17.75H16.2778C16.2778 17.75 18.5 17.75 18.5 19.9722V24C18.5 24 18.5 26.2222 16.2778 26.2222H15.7222C15.7222 26.2222 13.5 26.2222 13.5 24V19.9722C13.5 19.9722 13.5 17.75 15.7222 17.75Z" stroke="#EB8D38" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.5557 22.75V24C11.5557 25.1051 11.9947 26.1649 12.7761 26.9463C13.5575 27.7277 14.6173 28.1667 15.7223 28.1667H16.2779C17.383 28.1667 18.4428 27.7277 19.2242 26.9463C20.0056 26.1649 20.4446 25.1051 20.4446 24V22.75" stroke="#EB8D38 " stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center flex-grow pl-5'>
                                    <p className='text-white text-2xl'>Name of the Project</p>
                                    <p className='text-[#A9A9AD] text-xl'>24 days ago</p>

                                </div>

                            </div>
                        </Link>
                        <Link>
                            <div className='h-[325px] bg-[#262732] hover:bg-[#6e707f] rounded-xl flex flex-col mr-10'>
                                <div className='relative'>
                                    <img src='/img/recent/img2.png' className='rounded-tl-xl rounded-tr-xl'></img>
                                    <div className='w-[52px] h-[52px] bg-white rounded-lg absolute bottom-[-26px] ml-5 flex justify-center items-center'>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25 28.5C26.5913 28.5 28.1174 27.8679 29.2426 26.7426C30.3679 25.6174 31 24.0913 31 22.5C31 20.9087 30.3679 19.3826 29.2426 18.2574C28.1174 17.1321 26.5913 16.5 25 16.5C24.4696 16.5 23.9609 16.7107 23.5858 17.0858C23.2107 17.4609 23 17.9696 23 18.5V26.5C23 27.0304 23.2107 27.5391 23.5858 27.9142C23.9609 28.2893 24.4696 28.5 25 28.5Z" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M7 28.5C5.4087 28.5 3.88258 27.8679 2.75736 26.7426C1.63214 25.6174 1 24.0913 1 22.5C1 20.9087 1.63214 19.3826 2.75736 18.2574C3.88258 17.1321 5.4087 16.5 7 16.5C7.53043 16.5 8.03914 16.7107 8.41421 17.0858C8.78929 17.4609 9 17.9696 9 18.5V26.5C9 27.0304 8.78929 27.5391 8.41421 27.9142C8.03914 28.2893 7.53043 28.5 7 28.5Z" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M5 16.8413V14.5C5.00844 11.5852 6.17008 8.79222 8.23115 6.73115C10.2922 4.67008 13.0852 3.50844 16 3.5C18.9148 3.50844 21.7078 4.67008 23.7688 6.73115C25.8299 8.79222 26.9916 11.5852 27 14.5V16.8413" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M16 28.166V30.2493" stroke="#EB8D38" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15.7222 17.75H16.2778C16.2778 17.75 18.5 17.75 18.5 19.9722V24C18.5 24 18.5 26.2222 16.2778 26.2222H15.7222C15.7222 26.2222 13.5 26.2222 13.5 24V19.9722C13.5 19.9722 13.5 17.75 15.7222 17.75Z" stroke="#EB8D38" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.5557 22.75V24C11.5557 25.1051 11.9947 26.1649 12.7761 26.9463C13.5575 27.7277 14.6173 28.1667 15.7223 28.1667H16.2779C17.383 28.1667 18.4428 27.7277 19.2242 26.9463C20.0056 26.1649 20.4446 25.1051 20.4446 24V22.75" stroke="#EB8D38 " stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center flex-grow pl-5'>
                                    <p className='text-white text-2xl'>Name of the Project</p>
                                    <p className='text-[#A9A9AD] text-xl'>24 days ago</p>

                                </div>

                            </div>
                        </Link>
                        <Link>
                            <div className='h-[325px] bg-[#262732] hover:bg-[#6e707f] rounded-xl flex flex-col mr-10'>
                                <div className='relative'>
                                    <img src='/img/recent/img1.png' className='rounded-tl-xl rounded-tr-xl'></img>
                                    <div className='w-[52px] h-[52px] bg-white rounded-lg absolute bottom-[-26px] ml-5 flex justify-center items-center'>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25 28.5C26.5913 28.5 28.1174 27.8679 29.2426 26.7426C30.3679 25.6174 31 24.0913 31 22.5C31 20.9087 30.3679 19.3826 29.2426 18.2574C28.1174 17.1321 26.5913 16.5 25 16.5C24.4696 16.5 23.9609 16.7107 23.5858 17.0858C23.2107 17.4609 23 17.9696 23 18.5V26.5C23 27.0304 23.2107 27.5391 23.5858 27.9142C23.9609 28.2893 24.4696 28.5 25 28.5Z" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M7 28.5C5.4087 28.5 3.88258 27.8679 2.75736 26.7426C1.63214 25.6174 1 24.0913 1 22.5C1 20.9087 1.63214 19.3826 2.75736 18.2574C3.88258 17.1321 5.4087 16.5 7 16.5C7.53043 16.5 8.03914 16.7107 8.41421 17.0858C8.78929 17.4609 9 17.9696 9 18.5V26.5C9 27.0304 8.78929 27.5391 8.41421 27.9142C8.03914 28.2893 7.53043 28.5 7 28.5Z" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M5 16.8413V14.5C5.00844 11.5852 6.17008 8.79222 8.23115 6.73115C10.2922 4.67008 13.0852 3.50844 16 3.5C18.9148 3.50844 21.7078 4.67008 23.7688 6.73115C25.8299 8.79222 26.9916 11.5852 27 14.5V16.8413" stroke="#EB8D38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M16 28.166V30.2493" stroke="#EB8D38" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15.7222 17.75H16.2778C16.2778 17.75 18.5 17.75 18.5 19.9722V24C18.5 24 18.5 26.2222 16.2778 26.2222H15.7222C15.7222 26.2222 13.5 26.2222 13.5 24V19.9722C13.5 19.9722 13.5 17.75 15.7222 17.75Z" stroke="#EB8D38" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M11.5557 22.75V24C11.5557 25.1051 11.9947 26.1649 12.7761 26.9463C13.5575 27.7277 14.6173 28.1667 15.7223 28.1667H16.2779C17.383 28.1667 18.4428 27.7277 19.2242 26.9463C20.0056 26.1649 20.4446 25.1051 20.4446 24V22.75" stroke="#EB8D38 " stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div className='flex flex-col justify-center flex-grow pl-5'>
                                    <p className='text-white text-2xl'>Name of the Project</p>
                                    <p className='text-[#A9A9AD] text-xl'>24 days ago</p>

                                </div>

                            </div>
                        </Link>

                    </div>
                </div>
                <div className="flex-grow p-20 pt-0">
                    <p className="text-white text-2xl">Services</p>
                    <div className="flex justify-between mt-5">
                        <Link>
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/icons.png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">Create New</p>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/icons (1).png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">Open Recent</p>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/icons (2).png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">My Voices</p>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/users-group.png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">My Team</p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex justify-between mt-6">
                        <Link to="/dubbing">
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/icons (5).png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">Dubbing</p>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/icons (3).png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">Audiobook</p>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/icons (4).png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">Social Network Video</p>
                            </div>
                        </Link>
                        <Link>
                            <div className="flex flex-col justify-center items-center rounded-xl border border-[#4E3F3A] border-2 border-dashed w-[326px] h-[326px] hover:bg-[#6e707f]">
                                <img src="/img/home/live stream.png" className="w-[100px] h-[100px]" />
                                <p className="text-white text-xl mt-4">Live Stream</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}