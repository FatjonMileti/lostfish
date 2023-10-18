import { styled } from '@mui/system';
import React, { HTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from '../../../components/Modal';
import { Typography } from '../../../components/Typography';
import { Button } from '../../../components/Button';
import { IconButton } from '../../../components/IconButton';
import { Icon } from '../../../components/Icon';
import { Backdrop } from '../../../components/Backdrop';
import { Textarea } from '../../../components/Textarea';
import { Select } from '../../../components/Select/Select';
import { TextField } from '../../../components/TextField';

import { Map } from '../../../components/Map';
import { NearestThings } from '../../Matches/MatchesProperties/ViewProperty.NearestThings';
import { AreaOfInterest } from '../../PagesComponents/AreaOfInterest';

import { useUserStore } from '../../../globalState/user';
import axios from '../../../utils/axios';

import { ImageUpload } from './NewProperty.ImageUpload';

import { Switch } from '../../../components/Switch';
import { PropertyFormType } from './property.types';
import {useProfileStore} from "../../../globalState/profile";
import {
  AreaUnit,
  Building,
  BuildPurpose,
  Furnished,
  OutsideSpace,
  Parking,
  propertyFormSchema
} from './property.constants';
export interface NewPropertyProps extends HTMLAttributes<HTMLDivElement> {
  showStore: [boolean, (show: boolean) => void];
  propertyId?: string;
  setEditPropertyId: (propertyId: string) => void;
  fetchAssets: () => void;
}

export interface NewPropertyStateType {
  newImages: File[];
  generatedImages: any[];
  loadingProperty: boolean;
  savingProperty: boolean;
  deletePropertyConfirmationModal: boolean;
}

export const NewProperty = styled(
  ({ className, showStore, propertyId, setEditPropertyId, fetchAssets }: NewPropertyProps) => {
    const [modalVisibility, setModalVisibility] = showStore;

    const { auth } = useUserStore();

    const navigate = useNavigate();
    const profileStore = useProfileStore();

    const [state, setState] = React.useState<NewPropertyStateType>({
      newImages: [],
      generatedImages: [],
      loadingProperty: false,
      savingProperty: false,
      deletePropertyConfirmationModal: false
    });

    React.useEffect(() => {
      if(form)
      form.watch();
    }, []);



    const setNewImages = (newImages: File[]) => setState((state) => ({ ...state, newImages }));

    const setGeneratedImages = (generatedImages: any[]) =>
      setState((state) => ({ ...state, generatedImages }));

    React.useEffect(() => {
      if (propertyId) {
        setState((state) => ({ ...state, loadingProperty: true }));
        loadProperty().finally(() => {
          setState((state) => ({ ...state, loadingProperty: false }));
        });
      }
    }, [propertyId]);

    const form = useForm<PropertyFormType>({
      defaultValues: {
        title: '',
        location: {
          latitude: undefined,
          longitude: undefined
        },
        minBudget: undefined,
        maxBudget: undefined,
        bedrooms: undefined,
        bathrooms: undefined,
        buildingType: undefined,
        flatDetails: {},
        outsideSpace: {},
        area: undefined,
        areaUnit: AreaUnit.SquareMeter,
        parkingSpot: undefined,
        parkingType: undefined,
        epcRating: '',
        description: '',
        locationDetails: '',
        areaOfInterest: '',
        propertyImages: []
      },
      resolver: yupResolver(propertyFormSchema),
      mode: 'all'
    });

    const { register, formState } = form;
    const uploadImages = async (images: File[]): Promise<any> => {
      try {
        const data = new FormData();

        images.forEach((image) => {
          data.append('files', image);
        });

        const response = await axios(auth.access_token).post('/api/asset/upload', data, {
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
        const { data } = await axios(auth.access_token).get(`/api/asset/${propertyId}`);

        form.setValue('areaOfInterest', data.area_of_interest);

        form.setValue('location', {
          latitude: data?.asset_address?.latitude,
          longitude: data?.asset_address?.longitude
        });
        form.setValue('title', data.title);
        form.setValue('buildingType', data.property_type);

        form.setValue('flatDetails.propertyPurpose', data?.flat_details?.property_purpose);

        form.setValue('flatDetails.lift', data?.flat_details?.lift);
        form.setValue('flatDetails.security', data?.flat_details?.security);
        if (data?.flat_details?.floor) {
          form.setValue('flatDetails.floor', data.flat_details.floor);
        }

        form.setValue(
          `outsideSpace.${OutsideSpace.Garden}`,
          data.specific_property_features.includes(OutsideSpace.Garden)
        );
        form.setValue(
          `outsideSpace.${OutsideSpace.Terrace}`,
          data.specific_property_features.includes(OutsideSpace.Terrace)
        );
        form.setValue(
          `outsideSpace.${OutsideSpace.Balcony}`,
          data.specific_property_features.includes(OutsideSpace.Balcony)
        );

        form.setValue('area', data.floor_size);
        if (data?.floor_size_unit) {
          form.setValue('areaUnit', data.floor_size_unit);
        }
        if (data.room_details) {
          form.setValue('bedrooms', data.room_details.number_of_bedrooms);
          form.setValue('bathrooms', data.room_details.number_of_bathrooms);
        }

        if (data?.specific_property_features?.includes(Furnished.Unfurnished)) {
          form.setValue('furniture', Furnished.Unfurnished);
        } else if (data?.specific_property_features?.includes(Furnished.PartiallyFurnished)) {
          form.setValue('furniture', Furnished.PartiallyFurnished);
        } else if (data?.specific_property_features?.includes(Furnished.FullyFurnished)) {
          form.setValue('furniture', Furnished.FullyFurnished);
        }

        form.setValue('propertyImages', data.property_images);
        form.setValue('minBudget', data?.budget?.min_budget);
        form.setValue('maxBudget', data?.budget?.max_budget);
        form.setValue('parkingSpot', data?.parking_spot?.toString() || undefined);
        form.setValue('parkingType', data?.parking_details?.[0] || undefined);
        form.setValue('epcRating', data.epc_rating);
        form.setValue('description', data.description);
        form.setValue('locationDetails', data.location_details);
      } catch (err) {
        throw err;
      }
    };

    const generatePayload = () => {
      return {
        transaction_type_string: 'Rent',

        area_of_interest: form.getValues('areaOfInterest'),

        asset_address: form.getValues('location'),
        title: form.getValues('title'),
        property_type: form.getValues('buildingType'),
        flat_details: {
          property_purpose: form.getValues('flatDetails.propertyPurpose'),
          floor: form.getValues('flatDetails.floor'),
          lift: form.getValues('flatDetails.lift'),
          security: form.getValues('flatDetails.security')
        },
        floor_size: form.getValues('area') || undefined,
        floor_size_unit: form.getValues('areaUnit'),
        room_details: {
          number_of_bathrooms: form.getValues('bathrooms') || undefined,
          number_of_bedrooms: form.getValues('bedrooms') || undefined
        },
        specific_property_features: [
          form.getValues('furniture') ? [form.getValues('furniture')] : [],
          form.getValues('outsideSpace')[OutsideSpace.Balcony] ? [OutsideSpace.Balcony] : [],
          form.getValues('outsideSpace')[OutsideSpace.Terrace] ? [OutsideSpace.Terrace] : [],
          form.getValues('outsideSpace')[OutsideSpace.Garden] ? [OutsideSpace.Garden] : []
        ].flat(),

        property_images: form.getValues('propertyImages'),

        budget: {
          min_budget: form.getValues('minBudget') || undefined,
          max_budget: form.getValues('maxBudget') || undefined
        },

        parking_spot: form.getValues('parkingSpot') || undefined,
        parking_details: form.getValues('parkingType') ? [form.getValues('parkingType')] : [],
        epc_rating: form.getValues('epcRating'),
        description: form.getValues('description'),
        location_details: form.getValues('locationDetails')
      };
    };

    const processNewImages = async () => {
      try {
        if (state.newImages.length > 0) {
          const newImagesLinks = await uploadImages(state.newImages);
          setNewImages([]);
          form.setValue('propertyImages', [...form.getValues('propertyImages'), ...newImagesLinks]);
        }

        if (state.generatedImages.length > 0) {
          setGeneratedImages([]);
          form.setValue('propertyImages', [...form.getValues('propertyImages'), ...state.generatedImages]);
        }
      } catch (err) {
        throw err;
      }
    };

    const saveAsDraft = async () => {
      setState((state) => ({ ...state, savingProperty: true }));

      try {
        await processNewImages();

        const payload = generatePayload();

        const { data } = await (propertyId
          ? axios(auth.access_token).patch(`/api/asset/${propertyId}`, payload)
          : axios(auth.access_token).post('/api/asset/draft', payload));

        if (!propertyId) {
          setEditPropertyId(data._id);
        }
      } catch (err) {
        throw err;
      } finally {
        setState((state) => ({ ...state, savingProperty: false }));
      }
    };

    const startMatching = async () => {
      setState((state) => ({ ...state, savingProperty: true }));
      try {
        await processNewImages();

        const payload: any = {
          ...generatePayload(),
          status_string: 'Live'
        };

        const { data } = await (propertyId
          ? axios(auth.access_token).patch(`/api/asset/${propertyId}`, payload)
          : axios(auth.access_token).post('/api/asset', payload));

        if (!propertyId) {
          setEditPropertyId(data._id);
        }

       await profileStore.fetchProfile(auth.access_token);
        navigate('/matches');
      } catch (err) {
        throw err;
      } finally {
        setState((state) => ({ ...state, savingProperty: false }));
      }
    };

    const deleteProperty = async () => {
      try {
        await axios(auth.access_token).delete(`/api/asset/${propertyId}`);
      } catch (err) {
        throw err;
      }
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

    const propertyScore = (
      (100 / 7) *
      [
        !!form.getValues('title'),
        !!state.newImages.length || form.getValues('propertyImages').length || state.generatedImages.length,
        !!form.getValues('areaOfInterest'),
        !!form.getValues('minBudget') && !!form.getValues('maxBudget'),
        !!form.getValues('buildingType') &&
          !!form.getValues('bedrooms') &&
          !!form.getValues('bathrooms') &&
          !!form.getValues('area') &&
          !!form.getValues('parkingSpot') &&
          !!form.getValues('epcRating'),
        !!form.getValues('description') && !!form.getValues('locationDetails'),
        true
      ].filter((d) => d).length
    ).toFixed(0);

    return (
      <Modal
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
            <Button
              variant='secondary'
              disabled={Object.values(formState.errors).length > 0}
              onClick={async () => {
                await saveAsDraft();
                fetchAssets();
              }}>
              Save as draft
            </Button>
            <Button
              disabled={!form.formState.isValid}
              onClick={async () => {
                await startMatching();
              }}>
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
                  <Icon icon='banknote' size={24} />
                  <Typography variant='body5'>
                    Budget per month<span className='required-asterisk'> *</span>
                  </Typography>
                </div>
                <div className='min-max'>
                  <TextField
                    startAdornment={<div style={{ color: '#A7A7A7', margin: '0 0 0 12px' }}>£</div>}
                    placeholder='Min'
                    {...register('minBudget')}
                    error={!!form.formState.errors['minBudget']}
                    helperText={form.formState.errors['minBudget']?.message?.toString()}
                    type='number'
                  />
                  <TextField
                    startAdornment={<div style={{ color: '#A7A7A7', margin: '0 0 0 12px' }}>£</div>}
                    placeholder='Max'
                    {...register('maxBudget')}
                    error={!!form.formState.errors['maxBudget']}
                    helperText={form.formState.errors['maxBudget']?.message?.toString()}
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
                    <Icon icon='double-bed' /> Bedrooms
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
                    <Icon icon='bathtub' /> Bathrooms
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
                {...register('buildingType')}
                placeholder='Select building type'
                error={!!form.formState.errors['buildingType']}
                helperText={form.formState.errors['buildingType']?.message?.toString()}>
                <option></option>
                {Object.values(Building).map((type, typeIndex) => (
                  <option value={type} key={typeIndex}>
                    {type}
                  </option>
                ))}
              </Select>

              <div className='area-wrapper'>
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
                <Select {...register('areaUnit')}>
                  {Object.values(AreaUnit).map((unit, unitIndex: number) => (
                    <option value={unit} key={unitIndex}>
                      {unit}
                    </option>
                  ))}
                </Select>
              </div>

              <Select
                required
                label={
                  <>
                    <Icon icon='car' />
                    Parking spot
                  </>
                }
                {...register('parkingSpot')}
                error={!!form.formState.errors['parkingSpot']}
                helperText={form.formState.errors['parkingSpot']?.message?.toString()}>
                <option></option>
                <option value='0'>0</option>
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='3'>3</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </Select>

              {!!form.getValues('parkingSpot') && form.getValues('parkingSpot') !== '0' && (
                <Select
                  label={
                    <>
                      <Icon icon='car' />
                      Parking type
                    </>
                  }
                  {...register('parkingType')}
                  error={!!form.formState.errors['parkingType']}
                  helperText={form.formState.errors['parkingType']?.message?.toString()}>
                  <option></option>
                  {Object.values(Parking).map((parking, parkingIndex) => (
                    <option value={parking} key={parkingIndex}>
                      {parking}
                    </option>
                  ))}
                </Select>
              )}
              <Select
                label={
                  <>
                    <Icon icon='temperature' />
                    EPC Rating
                  </>
                }
                {...register('epcRating')}
                required
                error={!!form.formState.errors['epcRating']}
                helperText={form.formState.errors['epcRating']?.message?.toString()}>
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
            <div className='specific-property-features-section'>
              <Typography variant='body4' className='label'>
                Specific property features
              </Typography>
              <div className='section-content'>
                <Select
                  label='Furniture'
                  {...form.register('furniture')}
                  error={!!form.formState.errors['furniture']}
                  helperText={form.formState.errors['furniture']?.message?.toString()}>
                  <option></option>
                  {Object.values(Furnished).map((furnished, i) => (
                    <option value={furnished} key={i}>
                      {furnished}
                    </option>
                  ))}
                </Select>

                {Object.values(OutsideSpace).map((space, spaceIndex: number) =>
                  ((id: string) => (
                    <div className='switch-wrapper' key={spaceIndex}>
                      <Switch
                        id={id}
                        size='medium'
                        {...form.register(`outsideSpace.${space}`)}
                        checked={!!form.getValues('outsideSpace')[space]}
                      />
                      <label htmlFor={id}>{space}</label>
                    </div>
                  ))(React.useId())
                )}
              </div>
            </div>
            {form.getValues('buildingType') === 'Flats' && (
              <div className='flat-details-section'>
                <Typography variant='body4' className='label'>
                  Flat details
                </Typography>
                <div className='section-content'>
                  <Select label='Build Purpose' {...form.register('flatDetails.propertyPurpose')}>
                    <option></option>
                    {Object.values(BuildPurpose).map((purpose, i) => (
                      <option value={purpose} key={i}>
                        {purpose}
                      </option>
                    ))}
                  </Select>

                  <Select label='Floor' {...form.register('flatDetails.floor')}>
                    <option></option>
                    {Array.from({ length: 21 }, (_, i) => (
                      <option value={i} key={i}>
                        {i}
                      </option>
                    ))}
                  </Select>

                  {((id: string) => (
                    <div className='switch-wrapper'>
                      <Switch
                        id={id}
                        size='medium'
                        {...form.register('flatDetails.lift')}
                        checked={!!form.getValues('flatDetails.lift')}
                      />
                      <label htmlFor={id}>lift</label>
                    </div>
                  ))(Date.now().toString())}
                  {((id: string) => (
                    <div className='switch-wrapper'>
                      <Switch
                        id={id}
                        size='medium'
                        {...form.register('flatDetails.security')}
                        checked={!!form.getValues('flatDetails.security')}
                      />
                      <label htmlFor={id}>security</label>
                    </div>
                  ))(Date.now().toString())}
                </div>
              </div>
            )}
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
              {...register('locationDetails')}
              required
              rows={4}
              error={!!form.formState.errors['locationDetails']}
              helperText={form.formState.errors['locationDetails']?.message?.toString()}
            />
            <div className='upload-wrapper'>
              <div className='label'>
                <Typography variant='body5'>
                  Media <span className='required-asterisk'> *</span>
                </Typography>
              </div>
              <ImageUpload
                  className='upload'
                  onNewImages={(files) => {
                    setNewImages([...state.newImages, ...files]);
                  }}
                  onGenerateImages={(files) => {
                    setGeneratedImages([...state.generatedImages, ...files]);
                  }}
              />
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

                          {state.newImages.length > 0 &&
                              state.newImages.map((image: any, imageIndex: number) => (
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
                          {state.generatedImages.length > 0 &&
                              state.generatedImages.map((image: any, imageIndex: number) => (
                                  <div key={imageIndex} className='image-wrapper'>
                                    <IconButton
                                        size='large'
                                        className='remove-button'
                                        onClick={() => {
                                          setGeneratedImages(
                                              state.generatedImages.filter((_: any, i: number) => i !== imageIndex)
                                          );
                                        }}>
                                      <Icon icon='minus' size={11} />
                                    </IconButton>
                                    <img alt='property image' src={image.link} />
                                  </div>
                              ))}
                        </div>
                      </>
                  )}
                  control={form.control}
                  name='propertyImages'
              />
            </div>
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
                <Typography className='red'>{propertyScore}%</Typography>
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
                  checked: !!form.getValues('minBudget') && !!form.getValues('maxBudget')
                },
                {
                  name: ' Enter property details',
                  checked:
                    !!form.getValues('buildingType') &&
                    !!form.getValues('bedrooms') &&
                    !!form.getValues('bathrooms') &&
                    !!form.getValues('area') &&
                    !!form.getValues('parkingSpot') &&
                    !!form.getValues('epcRating')
                },
                {
                  name: ' Select points of interest',
                  checked: !!form.getValues('description') && !!form.getValues('locationDetails')
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
    height: auto;
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
        column-gap: 16px;

        .delete-button {
          color: #e5155a;
          background-color: white;
          border: none;
          .icon {
            color: #e5155a;
          }
        }

        .button {
          padding: 12px 20px;
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
          align-items: flex-start;

          .variant-outlined {
            label {
              display: flex;
              align-items: center;
              gap: 4px;
            }
            .area-icon {
              transform: rotate(-90deg);
            }
          }

          .property-wrapper {
            display: grid;
            row-gap: 4px;

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

          .area-wrapper {
            display: grid;
            grid-template-columns: auto 70px;
            column-gap: 4px;
            align-items: flex-end;
          }
        }
        .specific-property-features-section {
          display: grid;
          row-gap: 8px;
          .section-content {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            align-items: center;
            column-gap: 16px;

            .switch-wrapper {
              display: flex;
              column-gap: 8px;
              align-items: center;
              label {
                color: #0d2a38;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                font-family: 'Roobert', serif;
              }
            }
          }
        }
        .flat-details-section {
          display: grid;
          row-gap: 8px;
          .section-content {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            align-items: center;
            column-gap: 16px;

            .switch-wrapper {
              display: flex;
              column-gap: 8px;
              align-items: center;
              label {
                color: #0d2a38;
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                font-family: 'Roobert', serif;
              }
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
              font-family: Roobert, serif;
              font-size: 48px;
              color: #e5155a;
              font-weight: 700;
              line-height: 64px;
            }
          }

          .body3 {
            font-family: At Gambit, serif;
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
              color: #0d2a38;
            }

            &.active {
              .progress-item-indicator {
                background-color: #184d6d;
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
