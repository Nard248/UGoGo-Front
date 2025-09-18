// import {OfferCard} from "../../components/offerCard/OfferCard";
// import {Button} from "../../components/button/Button";
// import { useNavigate } from "react-router";
// import {getItems} from "../../api/route";
// import {useEffect, useState} from "react";
// import { Loading } from "../../components/loading/Loading";

// export const Items = () => {
//     const navigate = useNavigate();
//     const [items, setItems] = useState<any[]>([]);

//     useEffect(() => {
//         getItemsQuery();
//     }, [])

//     const getItemsQuery = async () => {
//         const data = await getItems();
//         setItems(data.data.results || []);
//     }

//     const findOffer = () => {

//     }

//     return (
//         items.length ?
//         <div className="flex flex-col gap-[6rem] w-full">
//             <div className="flex justify-between">
//                 <h3 className="text-[2rem] font-medium">
//                     My items
//                 </h3>
//                 <Button title={'Add item'} type={'primary'} handleClick={() => {navigate("/add-item")}} />
//             </div>
//             <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
//                 <OfferCard withRate={false} primaryButtonText={'Find an offer'} secondaryButtonText={'Edit item'} data={{}}/>
//             </div>
//             {/*<div className="flex justify-end gap-[4rem]">*/}
//             {/*    <Button title={'How it works'} type={'secondary'} handleClick={() => {}} />*/}
//             {/*    <Button title={'Find offers'} type={'primary'} handleClick={() => {}} />*/}
//             {/*</div>*/}
//         </div>
// :
//     <Loading />
//     )
// }
import { OfferCard } from "../../components/offerCard/OfferCard";
import { Button } from "../../components/button/Button";
import { useNavigate } from "react-router";
import { getItems } from "../../api/route";
import { useEffect, useState } from "react";
import { Loading } from "../../components/loading/Loading";

export const Items = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItemsQuery();
  }, []);

  const getItemsQuery = async () => {
    try {
      const data = await getItems();
      setItems(data.data.results || []);
      console.log(data.data.results);
      
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!items.length)
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p>No items found.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-[6rem] w-full">
      <div className="flex justify-between">
        <h3 className="text-[2rem] font-medium">My items</h3>
        <Button
          title="Add item"
          type="primary"
          handleClick={() => navigate("/add-item")}
        />
      </div>

      <div className="grid grid-cols-3 gap-[5.7rem] justify-items-center">
        {items.map((item) => (
          <OfferCard
            key={item.id}
            withRate={false}
            isOwnOffer={true}
            primaryButtonText="Find an offer"
            // secondaryButtonText="Edit item"
            data={{
              id: item.id,
              name: item.name,
              description: item.description,
              weight: item.weight,
              available_space: item.dimensions,
              available_weight: item.weight,
              user: { full_name: item.user.full_name },
              pictures: item.pictures,
              verified: item.verified,
            }}
            // onPrimaryClick={() => navigate(`/find-offers/${item.id}`)}
            onPrimaryClick={() => navigate(`/search-result`)}
            onSecondaryClick={() => navigate(`/edit-item/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
