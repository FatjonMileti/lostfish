import { styled } from '@mui/system';
import React, { HTMLAttributes, HTMLProps, useState } from 'react';
import { Modal } from '../../../components/Modal';

import axios from '../../../utils/axios';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import { Backdrop } from '../../../components/Backdrop';

import { useUserStore } from '../../../globalState/user';
import { useNavigate } from 'react-router-dom';
import { TextField } from '../../../components/TextField';
import multimedia from './image.svg';
import { Select } from '../../../components/Select/Select';
import { Textarea } from '../../../components/Textarea';
import { Upload } from '../../../components/Upload';
import { Map } from '../../Matches/MatchesProperties/ViewProperty.Map';
import { NearestThings } from '../../Matches/MatchesProperties/ViewProperty.NearestThings';
import { AreaOfInterest } from '../AreaOfInterest';
import { ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import request from '../../../utils/axios';
export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId?: string;
  setEditPropertyId: (propertyId: string) => void;
  fetchAssets: () => void;
}

type FormValues = {
  title: string;
  location: {
    latitude?: number;
    longitude?: number;
  };
  'min-budget': number;
  'max-budget': number;
  bedrooms: number;
  bathrooms: number;
  'building-type': string;
  area: number;
  'parking-spot': string;
  'EPC-Rating': string;
  description: string;
  'location-details': string;
  areaOfInterest: string;
  propertyImages: any[];
};

export interface NewPropertyStateType {
  newImages: File[];
  loadingProperty: boolean;
  savingProperty: boolean;
  deletePropertyConfirmationModal: boolean;
}

export const NewPropertyV2 = styled(
  ({ className, showStore, propertyId, setEditPropertyId, fetchAssets }: NewPropertyProps) => {
    const [modalVisibility, setModalVisibility] = showStore;

    const { auth } = useUserStore();

    const navigate = useNavigate();

    const [state, setState] = React.useState<NewPropertyStateType>({
      newImages: [],
      loadingProperty: false,
      savingProperty: false,
      deletePropertyConfirmationModal: false
    });

    React.useEffect(() => {
      form.watch();
    }, []);

    const setNewImages = (newImages: File[]) => setState((state) => ({ ...state, newImages }));

    React.useEffect(() => {
      if (propertyId) {
        setState((state) => ({ ...state, loadingProperty: true }));
        loadProperty().finally(() => {
          setState((state) => ({ ...state, loadingProperty: false }));
        });
      }
    }, [propertyId]);

    const formSchema: ObjectSchema<FormValues> = yup.object().shape({
      title: yup.string().required('Title is required'),
      location: yup.object().shape({
        latitude: yup.number().optional(),
        longitude: yup.number().optional()
      }),
      'min-budget': yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('Minimum budget is a required'),
      'max-budget': yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('Maximum budget is a required'),
      bedrooms: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('Number of bedrooms is required'),
      bathrooms: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .required('Number of bathrooms is required'),
      'building-type': yup.string().required('Building type is required'),
      area: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .min(1)
        .required('Area is required'),
      'parking-spot': yup.string().required('Parking spot is required'),
      'EPC-Rating': yup.string().required('EPC Rating is required'),
      description: yup.string().required('Description is required'),
      'location-details': yup.string().required('Description is required'),
      areaOfInterest: yup.string().required('Location is required'),
      propertyImages: yup.array().required()
    });

    const form = useForm<FormValues>({
      defaultValues: {
        title: '',
        location: {
          latitude: undefined,
          longitude: undefined
        },
        'min-budget': undefined,
        'max-budget': undefined,
        bedrooms: undefined,
        bathrooms: undefined,
        'building-type': '',
        area: undefined,
        'parking-spot': undefined,
        'EPC-Rating': '',
        description: '',
        'location-details': '',
        areaOfInterest: '',
        propertyImages: []
      },
      resolver: yupResolver(formSchema),
      mode: 'all'
    });

    const { register, formState } = form;
    const uploadImages = async (images: File[]): Promise<any> => {
      try {
        const data = new FormData();

        images.forEach((image) => {
          data.append('images', image);
        });

        const response = await axios(auth.access_token).post('/api/upload', data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        return response.data;
      } catch (err) {
        throw err;
      }
    };
    const loadProperty = async () => {
      try {
        const { data } = await request(auth.access_token).get(`/api/asset/${propertyId}`);

        // form.setValue('lookingFor', data.transaction_type_string);

        form.setValue('areaOfInterest', data.area_of_interest);

        form.setValue('location', {
          latitude: data?.asset_address?.latitude,
          longitude: data?.asset_address?.longitude
        });
        form.setValue('title', data.title);
        form.setValue('building-type', data.property_type);

        form.setValue('area', data.floor_size);
        form.setValue('bedrooms', data.room_details.number_of_bedrooms);
        form.setValue('bathrooms', data.room_details.number_of_bathrooms);
        form.setValue('propertyImages', data.property_images);
        form.setValue('min-budget', data.budget.min_budget);
        form.setValue('max-budget', data.budget.max_budget);
        form.setValue('parking-spot', data.parking_spot);
        form.setValue('EPC-Rating', data.EPC_rating);
        form.setValue('description', data.description);
        form.setValue('location-details', data.location_details);
      } catch (err) {
        throw err;
      }
    };

    const saveAsDraft = async () => {
      try {
        if (state.newImages.length > 0) {
          const newImagesLinks = await uploadImages(state.newImages);
          setNewImages([]);
          form.setValue('propertyImages', [...form.getValues('propertyImages'), ...newImagesLinks]);
        }

        const payload = {
          transaction_type_string: 'Rent',

          area_of_interest: form.getValues('areaOfInterest'),

          asset_address: form.getValues('location'),
          title: form.getValues('title'),
          property_type: form.getValues('building-type'),
          floor_size: form.getValues('area'),
          room_details: {
            number_of_bathrooms: form.getValues('bathrooms'),
            number_of_bedrooms: form.getValues('bedrooms')
          },

          property_images: form.getValues('propertyImages'),

          budget: {
            min_budget: form.getValues('min-budget'),
            max_budget: form.getValues('max-budget')
          },

          parking_spot: form.getValues('parking-spot'),
          EPC_rating: form.getValues('EPC-Rating'),
          description: form.getValues('description'),
          location_details: form.getValues('location-details')
        };

        console.log('paylod', payload);

        const { data } = await (propertyId
          ? axios(auth.access_token).patch(`/api/asset/${propertyId}`, payload)
          : axios(auth.access_token).post('/api/asset/draft', payload));

        if (!propertyId) {
          setEditPropertyId(data._id);
        }
      } catch (err) {
        throw err;
      }
    };
    const startMatching = async () => {
      try {
        if (state.newImages.length > 0) {
          const newImagesLinks = await uploadImages(state.newImages);
          setNewImages([]);
          form.setValue('propertyImages', [...form.getValues('propertyImages'), ...newImagesLinks]);
        }

        const payload: any = {
          transaction_type_string: 'Rent',

          area_of_interest: form.getValues('areaOfInterest'),

          asset_address: form.getValues('location'),
          title: form.getValues('title'),
          property_type: form.getValues('building-type'),
          floor_size: form.getValues('area'),
          room_details: {
            number_of_bathrooms: form.getValues('bathrooms'),
            number_of_bedrooms: form.getValues('bedrooms')
          },

          property_images: form.getValues('propertyImages'),

          budget: {
            min_budget: form.getValues('min-budget'),
            max_budget: form.getValues('max-budget')
          },

          parking_spot: form.getValues('parking-spot'),
          EPC_rating: form.getValues('EPC-Rating'),
          description: form.getValues('description'),
          location_details: form.getValues('location-details'),
          status_string: 'Live'
        };

        const { data } = await (propertyId
          ? axios(auth.access_token).patch(`/api/asset/${propertyId}`, payload)
          : axios(auth.access_token).post('/api/asset', payload));

        if (!propertyId) {
          setEditPropertyId(data._id);

          navigate('/matches');
        }
      } catch (err) {
        throw err;
      }
    };

    const deleteProperty = async () => {
      await axios(auth.access_token).delete(`/api/asset/${propertyId}`);
    };
    const onDeleteConfirm = async () => {
      try {
        setState((state) => ({ ...state, deletePropertyConfirmationModal: false }));
        setState((state) => ({ ...state, savingProperty: true }));
        await deleteProperty();
      } finally {
        setState((state) => ({ ...state, savingProperty: false }));
        setModalVisibility(false);
        fetchAssets();
      }
    };

    const onDeleteClick = () => {
      setState((state) => ({ ...state, deletePropertyConfirmationModal: true }));
    };
    const onCancelDelete = () => {
      setState((state) => ({ ...state, deletePropertyConfirmationModal: false }));
    };

    return (
      <Modal
        // disableScrollLock
        className={`new-property-modal ${className}`}
        open={modalVisibility}
        onBackdropClick={() => setModalVisibility(false)}
        onClose={() => setModalVisibility(false)}>
        <Backdrop open={state.savingProperty}></Backdrop>
        <div className='header'>
          <Typography variant='body2'>Add property for rent</Typography>
          <div className='right-side'>
            {propertyId && (
              <Button
                className='delete-button'
                startIcon={<Icon icon='trash' size={20} />}
                onClick={onDeleteClick}>
                Delete property
              </Button>
            )}
            <Button variant='secondary' onClick={saveAsDraft}>
              Save as draft
            </Button>
            <Button
              variant='secondary'
              disabled={!form.formState.isValid}
              active={form.formState.isValid}
              onClick={startMatching}>
              Start matching
            </Button>
            <IconButton size='large' noBackground onClick={() => setModalVisibility(false)}>
              <Icon icon='close' size={12} />
            </IconButton>
          </div>
        </div>
        <div className='container'>
          <div className='left'>
            <TextField
              placeholder='Enter the title'
              label='Title'
              required
              {...register('title')}
              error={!!form.formState.errors.title}
              helperText={form.formState.errors.title?.message?.toString()}
              type='string'
            />
            <div className='upload-wrapper'>
              <div className='label'>
                <Typography variant='body5'>
                  Media <span className='required-asterisk'> *</span>
                </Typography>
              </div>
              <div className='upload'>
                <div className='drag-drop'>
                  <div className='img' style={{ backgroundImage: `url(${multimedia})` }}></div>
                  <Typography variant='body4'>
                    Upload photos and videos or drag & drop them in here
                  </Typography>
                </div>
                <Upload
                  multiple
                  accept='image/*'
                  onFiles={(files) => {
                    setNewImages([...state.newImages, ...files]);
                  }}
                  button={
                    <Button variant='secondary' size='large' startIcon={<Icon icon='plus' size={14} />}>
                      Upload media
                    </Button>
                  }></Upload>
              </div>
              <Controller
                render={({ field: { value = [], onChange } }) => (
                  <>
                    <div className='images-list'>
                      {value.map((image: any, imageIndex: number) => (
                        <div key={imageIndex} className='image-wrapper'>
                          <IconButton
                            size='large'
                            className='remove-button'
                            onClick={async () => {
                              onChange({
                                target: { value: value.filter((_: any, i: number) => i !== imageIndex) }
                              });
                            }}>
                            <Icon icon='minus' size={11} />
                          </IconButton>
                          <img alt='property image' src={`${image?.link}`} />
                        </div>
                      ))}

                      {state.newImages.map((image: any, imageIndex: number) => (
                        <div key={imageIndex} className='image-wrapper'>
                          <IconButton
                            size='large'
                            className='remove-button'
                            onClick={() => {
                              setNewImages(state.newImages.filter((_: any, i: number) => i !== imageIndex));
                            }}>
                            <Icon icon='minus' size={11} />
                          </IconButton>
                          <img alt='property image' src={URL.createObjectURL(image)} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
                control={form.control}
                name='propertyImages'
              />
            </div>
            <div className='property-preferences-section'>
              <AreaOfInterest
                placeholder='Enter location'
                label={
                  <>
                    <Icon icon='location' />
                    Location
                  </>
                }
                required
                areaOfInterest={form.getValues('areaOfInterest')}
                onAreaChange={({ formattedAddress, location }) => {
                  form.setValue('areaOfInterest', formattedAddress);
                  form.setValue('location', location);
                }}
                error={!!form.formState.errors.areaOfInterest}
                helperText={form.formState.errors.areaOfInterest?.message?.toString()}
                type='string'
              />
              <div className='property-wrapper'>
                <div className='label'>
                  <Icon icon='banknote' size={24}/>
                  <Typography variant='body5'>
                    Budget <span className='required-asterisk'> *</span>
                  </Typography>
                </div>
                <div className='min-max'>
                  <TextField
                    startAdornment={<div style={{ color: '#A7A7A7', margin: '0 0 0 12px' }}>£</div>}
                    placeholder='Min'
                    {...register('min-budget')}
                    error={!!form.formState.errors['min-budget']}
                    helperText={form.formState.errors['min-budget']?.message?.toString()}
                    type='number'
                  />
                  <TextField
                    startAdornment={<div style={{ color: '#A7A7A7', margin: '0 0 0 12px' }}>£</div>}
                    placeholder='Max'
                    {...register('max-budget')}
                    error={!!form.formState.errors['max-budget']}
                    helperText={form.formState.errors['max-budget']?.message?.toString()}
                    type='number'
                  />
                </div>
              </div>
                <TextField
                  placeholder='No. of bedrooms'
                  {...register('bedrooms')}
                  required
                  label={
                    <>
                      <Icon icon='double-bed' />  Bedrooms
                    </>
                  }
                  error={!!form.formState.errors.bedrooms}
                  helperText={form.formState.errors.bedrooms?.message?.toString()}
                  type='number'
                />
                <TextField
                  placeholder='No. of bathrooms'
                  {...register('bathrooms')}
                  required
                  label={
                    <>
                      <Icon icon='bathtub' />  Bathrooms
                    </>
                  }
                  error={!!form.formState.errors.bathrooms}
                  helperText={form.formState.errors.bathrooms?.message?.toString()}
                  type='number'
                />
                <Select
                  label={
                  <>
                    <Icon icon='building' />
                      Building type
                  </>
                }
                  required
                  placeholder='Select building type'
                  error={!!form.formState.errors['building-type']}
                  helperText={form.formState.errors['building-type']?.message?.toString()}
                  {...register('building-type')}
                >
                  <option></option>
                  <option value='Detached'>Detached</option>
                  <option value='Semi-Detached'>Semi-Detached</option>
                  <option value='Terraced'>Terraced</option>
                  <option value='Flats'>Flats</option>
                  <option value='Bungalows'>Bungalows</option>
                  <option value='Farms/Land'>Farms/Land</option>
                </Select>

                <TextField
                  placeholder='Enter the area'
                  {...register('area')}
                  required
                  label={
                    <>
                      <Icon className='area-icon' icon='ruler' /> Area
                    </>
                  }
                  error={!!form.formState.errors.area}
                  helperText={form.formState.errors.area?.message?.toString()}
                  type='number'
                />

                <Select
                  {...register('parking-spot')}
                  required
                  label={
                    <>
                      <Icon icon='car' />
                        Parking spot
                    </>
                  }
                  error={!!form.formState.errors['parking-spot']}
                  helperText={form.formState.errors['parking-spot']?.message?.toString()}>
                  <option></option>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                </Select>
                <Select
                    label={
                      <>
                        <Icon icon='temperature' />
                          EPC Rating
                      </>
                    }
                  {...register('EPC-Rating')}
                  required
                  error={!!form.formState.errors['EPC-Rating']}
                  helperText={form.formState.errors['EPC-Rating']?.message?.toString()}>
                  <option></option>
                  <option value='A'>A</option>
                  <option value='B'>B</option>
                  <option value='C'>C</option>
                  <option value='D'>D</option>
                  <option value='E'>E</option>
                  <option value='F'>F</option>
                  <option value='G'>G</option>
                </Select>
            </div>
            <Textarea
              placeholder='Enter description'
              label='Description'
              {...register('description')}
              required
              rows={4}
              error={!!form.formState.errors.description}
              helperText={form.formState.errors.description?.message?.toString()}
            />
            <Textarea
              placeholder='Enter location details'
              label='Location details'
              {...register('location-details')}
              required
              rows={4}
              error={!!form.formState.errors['location-details']}
              helperText={form.formState.errors['location-details']?.message?.toString()}
            />
            <Map
              address={{
                lat: form.getValues('location').latitude || 0,
                lng: form.getValues('location').longitude || 0
              }}
            />
            <NearestThings
              location={{
                lat: form.getValues('location').latitude || 0,
                lng: form.getValues('location').longitude || 0
              }}
            />
            <div className='facilities-wrapper'>
              <Typography variant='body4' className='label'>
                Facilities
              </Typography>
              <div className='facilities'>
                <ul>
                  <li>
                    <Typography variant='body4'>Open plan reception/dining room</Typography>
                  </li>
                  <li>
                    <Typography variant='body4'>Modern kitchen with Siemens appliances</Typography>
                  </li>
                  <li>
                    <Typography variant='body4'> Two double bedrooms</Typography>
                  </li>
                </ul>

                <ul>
                  <li>
                    <Typography variant='body4'>Two bathrooms (en-suite) </Typography>
                  </li>
                  <li>
                    <Typography variant='body4'>Private patio garden</Typography>
                  </li>
                  <li>
                    <Typography variant='body4'>Duplex apartment</Typography>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='right'>
            <div className='top'>
              <div className='property-score'>
                <Typography variant='body5'>Property score</Typography>
                <Typography className='red'>20%</Typography>
              </div>
              <Typography variant='body3'>Improve your property’s score by adding more details</Typography>
            </div>
            <div className='sections-progress-list'>
              {[
                {
                  name: 'Add a title to your listing',
                  checked: !!form.getValues('title')
                },
                {
                  name: 'Upload photos of your property',
                  checked: !!state.newImages.length || form.getValues('propertyImages').length
                },
                {
                  name: 'Enter the location of your property',
                  checked: !!form.getValues('areaOfInterest')
                },
                {
                  name: ' Enter budget details',
                  checked: !!form.getValues('min-budget') && !!form.getValues('max-budget')
                },
                {
                  name: ' Enter property details',
                  checked:
                    !!form.getValues('building-type') &&
                    !!form.getValues('bedrooms') &&
                    !!form.getValues('bathrooms') &&
                    !!form.getValues('area') &&
                    !!form.getValues('parking-spot') &&
                    !!form.getValues('EPC-Rating')
                },
                {
                  name: ' Select points of interest',
                  checked: !!form.getValues('description') && !!form.getValues('location-details')
                },
                {
                  name: ' Enter facilities & amenities',
                  checked: true
                }
              ].map((progressItem, progressItemIndex) => (
                <div
                  className={`progress-item ${progressItem.checked ? 'active' : ''}`}
                  key={progressItemIndex}>
                  <div className='progress-item-indicator'>
                    <Icon icon='checked' size={10} />
                  </div>
                  <Typography variant='body4' className='progress-item-text'>
                    {progressItem.name}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Modal
          disableScrollLock
          open={state.deletePropertyConfirmationModal}
          className='delete-confirm-modal'
          onBackdropClick={onCancelDelete}>
          <div className='modal-header'>
            <IconButton size='large' noBackground onClick={onCancelDelete}>
              <Icon icon='close' size={12} />
            </IconButton>
          </div>
          <Typography variant='body2' className='title'>
            Are you sure you want to delete the property?
          </Typography>
          <Typography variant='body4' className='description'>
            The action can be reverted anymore. Do you want to delete this property?
          </Typography>
          <div className='actions'>
            <Button size='large' variant='secondary' onClick={onCancelDelete}>
              Cancel
            </Button>
            <Button size='large' onClick={onDeleteConfirm}>
              Delete
            </Button>
          </div>
        </Modal>
      </Modal>
    );
  }
)`
  &.new-property-modal {
    overflow-y: auto;
    max-height: calc(100vh - 80px);
    height: max-content;
    width: 100vw;
    top: calc(50% + 40px);

    border-radius: 12px 12px 0px 0px;

    .modal-container {
      padding: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 36px 36px 16px 36px;

      .body2 {
        font-weight: 400;
        line-height: 40px;
      }

      .right-side {
        display: flex;
        column-gap: 32px;

        .delete-button {
          color: #e5155a;
          background-color: white;
          border: none;
          .icon {
            color: #e5155a;
          }
        }

        .button {
          //width: 141px;
          &.active {
            color: #fff;
            background-color: #184d6d;
            border: 1px solid #184d6d;
          }

          .icon {
            color: #e5155a;
          }
        }
      }
    }
    .container {
      padding: 32px 36px;
      display: grid;
      grid-template-columns: 2fr 1fr;
      justify-content: space-between;
      align-items: start;
      box-sizing: border-box;
      column-gap: 24px;

      .left {
        width: 100%;
        display: grid;
        align-items: start;
        gap: 24px;
        box-sizing: border-box;

        .text-field {
          width: 100%;
        }

        .upload-wrapper {
          display: grid;
          gap: 4px;

          .label {
            .typography {
              font-weight: 600;
              font-size: 12px;
              line-height: 16px;
              color: #0d2a38;

              .required-asterisk {
                color: #b4263b;
                font-weight: 600;
                font-size: 12px;
                line-height: 16px;
              }
            }
          }
          .upload {
            width: 100%;
            display: grid;
            padding: 64px 0px;
            border-radius: 8px;
            border: 1px dashed #cfd5d5;
            align-items: center;
            justify-items: center;
            gap: 24px;

            .drag-drop {
              display: grid;
              align-items: center;
              gap: 24px;

              .img {
                width: 64px;
                height: 64px;
                background-repeat: no-repeat;
                background-size: cover;
                margin: 0 auto;
              }

              .typography {
                font-size: 18px;
                font-weight: 700;
              }
            }
          }
          .images-list {
            display: flex;
            column-gap: 2px;
            flex-wrap: wrap;
            .image-wrapper {
              border-radius: 4px;
              height: 64px;
              width: 96px;
              position: relative;

              .remove-button {
                position: absolute;
                color: white;
                background-color: #e5155a;
                padding: 3px;
                right: 2px;
                top: 2px;
              }

              img {
                height: 100%;
                width: 100%;
                border-radius: 4px;
              }
            }
          }
        }
        .property-preferences-section {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          column-gap: 16px;
          row-gap: 24px;

          .variant-outlined {
            label {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }
          
          .property-wrapper {
            display: grid;
            row-gap: 4px;
            

            .area-icon {
              transform: rotate(-90deg);
            }
            
            .label {
              display: flex;
              gap: 4px;
              align-items: center;
              .typography {
                font-weight: 600;
                font-size: 12px;
                line-height: 16px;
                color: #0d2a38;

                .required-asterisk {
                  color: #b4263b;
                  font-weight: 600;
                  font-size: 12px;
                  line-height: 16px;
                }
              }
            }
            .min-max {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px;
            }
          }
        }
        .facilities-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          align-self: stretch;

          .label {
            font-size: 18px;
            color: #0d2a38;
            font-weight: 700;
          }

          .facilities {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            align-self: stretch;

            .typography {
              flex: 1 0 0;
              font-style: normal;
              font-weight: 400;
            }
          }
        }
      }
      .right {
        display: grid;
        width: 100%;
        padding: 32px;
        border-radius: 12px;
        background: #f7f1e7;
        gap: 24px;
        box-sizing: border-box;

        .top {
          display: grid;
          gap: 16px;

          .property-score {
            display: grid;
            gap: 4px;

            .body5 {
              color: #a7a7a7;
              font-weight: 500;
              line-height: 16px;
            }

            .red {
              font-size: 48px;
              color: #e5155a;
              font-weight: 700;
              line-height: 64px;
            }
          }
          .body3 {
            font-weight: 400;
          }
        }
        .sections-progress-list {
          display: grid;
          row-gap: 16px;
          .progress-item {
            display: flex;
            column-gap: 8px;

            .progress-item-indicator {
              border-radius: 50%;
              background-color: #cfd5d5;
              color: #cfd5d5;
              padding: 7px;
              width: 24px;
              height: 24px;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .progress-item-text {
              color: #a7a7a7;
            }

            &.active {
              .progress-item-indicator {
                background-color: #184d6d;
              }
              .progress-item-text {
                color: black;
              }
            }
          }
        }
      }
    }
    .delete-confirm-modal {
      .modal-container {
        padding: 0;
      }
      padding: 24px;
      max-width: 440px;
      .modal-header {
        display: flex;
        justify-content: flex-end;
      }
      .title {
        margin-top: 24px;
        text-align: center;
      }

      .description {
        margin-top: 16px;
        text-align: center;
      }
      .actions {
        margin-top: 48px;
        display: flex;
        column-gap: 16px;
        .button {
          flex-grow: 1;
        }
      }
    }
  }
`;
