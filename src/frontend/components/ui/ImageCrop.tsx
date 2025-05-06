import {
  Box,
  Fade,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Slider,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import Cropper from 'react-easy-crop';
import { useTranslation } from 'react-i18next';

import { ArrowDropDownOutlined, FlipOutlined, RotateLeft, RotateRight, ZoomIn, ZoomOut } from '../icons';
import { TooltipWrapper } from './TooltipWrapper';

import type { CropFlip, CropParams } from '../../core/types';
import type { MenuProps } from '@mui/material';
import type { SyntheticEvent } from 'react';
import type { Area, CropperProps, Point, Size } from 'react-easy-crop';

interface Props {
  image: string;
  cropSize: Size;
  onCropUpdate: (cropParams: CropParams) => void;
}

enum ZoomOptions {
  min = 1,
  max = 3,
  step = 0.1,
}

/**
 * Cropping image using react-easy-crop
 * @url https://valentinh.github.io/react-easy-crop/
 *
 * @param {string} image - a URL to a picture or base64 dataURL of a picture.
 * @param cropSize - dimensions (width, height) of the cropping viewfinder (does not affect the actual crop size).
 * @param onCropUpdate - a controller for external state to store cropping params (area, rotation, flip)
 * @constructor
 */
export const ImageCrop = ({ image, cropSize, onCropUpdate }: Props) => {
  const { t } = useTranslation();
  const mobileViewport = useMediaQuery(useTheme().breakpoints.down('sm'));

  const [menuAnchor, setMenuAnchor] = useState<null | Element>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [flip, setFlip] = useState<CropFlip>({ vertical: false, horizontal: false });
  const [rotation, setRotation] = useState<number>(0);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    onCropUpdate({ area: croppedAreaPixels, rotation: rotation, flip: flip });
  };

  const onRotationChange = (newRotation: number) => {
    if (newRotation >= 360 || newRotation <= -360) {
      newRotation = 0;
    }
    setRotation(newRotation);
  };

  const handleMenuClick = (event: SyntheticEvent) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const zoomByStep = (direction: 'in' | 'out') => {
    let newZoom = direction === 'in' ? zoom + ZoomOptions.step : zoom - ZoomOptions.step;

    if (newZoom <= ZoomOptions.min) {
      newZoom = ZoomOptions.min;
    }
    if (newZoom >= ZoomOptions.max) {
      newZoom = ZoomOptions.max;
    }
    setZoom(newZoom);
  };

  const rotateLeft = () => {
    onRotationChange(rotation - 90);
    !!menuAnchor && handleMenuClose();
  };
  const rotateRight = () => {
    onRotationChange(rotation + 90);
    !!menuAnchor && handleMenuClose();
  };

  const flipVertical = () => {
    setFlip({ ...flip, vertical: !flip.vertical });
    !!menuAnchor && handleMenuClose();
  };

  const flipHorizontal = () => {
    setFlip({ ...flip, horizontal: !flip.horizontal });
    !!menuAnchor && handleMenuClose();
  };

  const menuProps: MenuProps = {
    anchorEl: menuAnchor,
    open: !!menuAnchor,
    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
    transformOrigin: { vertical: 'top', horizontal: 'right' },
    slots: { transition: Fade },
    onClose: handleMenuClose,
  };

  const cropperProps: Pick<CropperProps, 'crop'> & Partial<CropperProps> = {
    crop: crop,
    image: image,
    transform: [
      `translate(${crop.x}px, ${crop.y}px)`,
      `rotateZ(${rotation}deg)`,
      `rotateY(${flip.horizontal ? 180 : 0}deg)`,
      `rotateX(${flip.vertical ? 180 : 0}deg)`,
      `scale(${zoom})`,
    ].join(' '),
    zoom: zoom,
    rotation: rotation,
    aspect: 1,
    cropShape: 'round',
    cropSize: cropSize,
    showGrid: false,
  };

  return (
    <Wrapper container spacing={1} className='crop-wrapper'>
      <CropContainer size={12} className='crop-container' height={cropSize.height}>
        <CropAreaRelative>
          <Cropper
            {...cropperProps}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={onRotationChange}
          />
        </CropAreaRelative>
      </CropContainer>
      <ControlsContainer size='grow' className='crop-controls'>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center', width: '100%' }}>
          <TooltipWrapper title={t('imageCrop.zoomOut')}>
            <IconButton size='small' onClick={() => zoomByStep('out')}>
              <ZoomOut />
            </IconButton>
          </TooltipWrapper>
          <Slider
            value={zoom}
            min={ZoomOptions.min}
            max={ZoomOptions.max}
            step={ZoomOptions.step}
            onChange={(e, zoom) => setZoom(zoom as number)}
          />
          <TooltipWrapper title={t('imageCrop.zoomIn')}>
            <IconButton size='small' onClick={() => zoomByStep('in')}>
              <ZoomIn />
            </IconButton>
          </TooltipWrapper>
          {!mobileViewport ? (
            <>
              <TooltipWrapper title={t('imageCrop.flipVertical')}>
                <IconButton size='small' onClick={flipVertical} children={<FlipOutlined transform='rotate(90)' />} />
              </TooltipWrapper>
              <TooltipWrapper title={t('imageCrop.flipHorizontal')}>
                <IconButton size='small' onClick={flipHorizontal} children={<FlipOutlined />} />
              </TooltipWrapper>
              <TooltipWrapper title={t('imageCrop.rotateLeft')}>
                <IconButton size='small' onClick={rotateLeft} children={<RotateLeft />} />
              </TooltipWrapper>
              <TooltipWrapper title={t('imageCrop.rotateRight')}>
                <IconButton size='small' onClick={rotateRight} children={<RotateRight />} />
              </TooltipWrapper>
            </>
          ) : (
            <span>
              <TooltipWrapper title={t('imageCrop.options')}>
                <IconButton size='small' onClick={handleMenuClick}>
                  <ArrowDropDownOutlined />
                </IconButton>
              </TooltipWrapper>
              <Menu {...menuProps}>
                <MenuItem dense onClick={flipVertical}>
                  <ListItemIcon>
                    <FlipOutlined fontSize='small' transform='rotate(90)' />
                  </ListItemIcon>
                  <ListItemText>{t('imageCrop.flipVertical')}</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={flipHorizontal}>
                  <ListItemIcon>
                    <FlipOutlined fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>{t('imageCrop.flipHorizontal')}</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={rotateLeft}>
                  <ListItemIcon>
                    <RotateLeft fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>{t('imageCrop.rotateLeft')}</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={rotateRight}>
                  <ListItemIcon>
                    <RotateRight fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>{t('imageCrop.rotateRight')}</ListItemText>
                </MenuItem>
              </Menu>
            </span>
          )}
        </Stack>
      </ControlsContainer>
    </Wrapper>
  );
};

const Wrapper = styled(Grid)({
  display: 'flex',
  alignItems: 'flex-start',
  alignContent: 'space-between',
  flex: '1 0 auto',
});

const CropContainer = styled(Grid)({
  display: 'flex',
  alignItems: 'flex-start',
});

const CropAreaRelative = styled(Box)({
  position: 'relative',
  height: '100%',
  width: '100%',
});

const ControlsContainer = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});
