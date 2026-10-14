import {preload} from 'react-dom';
import {getImageProps} from 'next/image';
import {restaurantCardImage} from '@/lib/images';
import {Browse} from '@/components/browse';
import catalog from '../../../api/seed/restaurants.json';

export default function Page(){
 // The first late-night card is known at build time: start its image before hydration/API.
 const first=catalog.find(restaurant=>restaurant.late_night)??catalog[0];
 const {props}=getImageProps({src:restaurantCardImage(first.image_url),alt:'',quality:50,fill:true,sizes:'(max-width: 430px) 100vw, 398px'});
 preload(props.src,{as:'image',imageSrcSet:props.srcSet,imageSizes:props.sizes,fetchPriority:'high'});
 return <Browse initialRestaurants={catalog}/>;
}
