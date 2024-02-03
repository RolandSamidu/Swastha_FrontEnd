import { Grid } from '@material-ui/core'
import PharmacyService from 'app/services/PharmacyService'
import React, { useEffect, useState } from 'react'
import Tree from 'react-d3-tree'
import { useCenteredTree } from "./helpers";

const FlowDiagramComp = (props) => {
    const [dataSet, setDataSet] = useState({})

    // useEffect(async () => {
    //     let res = await PharmacyService.fetchHierachy(props.id)
    //     if (200 == res.status) {
    //         setDataSet(res.data.view)
    //     } else {
    //         console.log('Error')
    //     }
    // }, [props.id])

    const dummyData = {
        view: [
            {
                child_id: 'd1be1174-cbee-4c7a-92c7-f840b933f1c9',
                parent_id: '6c2aba94-5153-498d-a98b-6137554d9496',
                createdAt: '2022-03-22T10:25:32.599Z',
                id: '6c2aba94-5153-498d-a98b-6137554d9496',
                department_id: '1e877228-d451-41e4-8c41-c6674ed3ea42',
                name: 'hospital 1',
                store_id: 'b92d9',
                store_type: 'N/A',
                issuance_type: 'pharmacy',
                owner_id: '001',
                location: 'ffggf',
                is_admin: true,
                is_counter: true,
                is_drug_store: null,
                status: 'Active',
                updatedAt: '2022-03-22T10:25:32.599Z',
                children: [
                    {
                        child_id: '6c2aba94-5153-498d-a98b-6137554d9496',
                        parent_id: '67c64c8c-dca4-465f-9aab-6af9db9549b2',
                        createdAt: '2022-03-22T10:23:32.689Z',
                        id: '67c64c8c-dca4-465f-9aab-6af9db9549b2',
                        department_id: '1e877228-d451-41e4-8c41-c6674ed3ea42',
                        name: 'MSSD 2',
                        store_id: 'b92d9',
                        store_type: 'N/A',
                        issuance_type: 'Main',
                        owner_id: '001',
                        location: 'ffggf',
                        is_admin: true,
                        is_counter: true,
                        is_drug_store: null,
                        status: 'Active',
                        updatedAt: '2022-03-22T10:23:32.689Z',
                        children: [
                            {
                                child_id:
                                    '67c64c8c-dca4-465f-9aab-6af9db9549b2',
                                parent_id:
                                    '461f9b1a-4690-446a-9968-b8304887e8e2',
                                createdAt: '2022-03-22T10:16:13.702Z',
                                id: '461f9b1a-4690-446a-9968-b8304887e8e2',
                                department_id:
                                    '1e877228-d451-41e4-8c41-c6674ed3ea42',
                                name: 'MSD',
                                store_id: 'b02d9',
                                store_type: 'N/A',
                                issuance_type: 'Main',
                                owner_id: '000',
                                location: 'ffggf',
                                is_admin: true,
                                is_counter: true,
                                is_drug_store: null,
                                status: 'Active',
                                updatedAt: '2022-03-22T10:16:13.702Z',
                                children: [],
                            },
                        ],
                    },
                    {
                        child_id: '6c2aba94-5153-498d-a98b-6137554d9496',
                        parent_id: '2c835df3-2c72-426e-befa-ee145f7d0d64',
                        createdAt: '2022-03-22T10:22:21.528Z',
                        id: '2c835df3-2c72-426e-befa-ee145f7d0d64',
                        department_id: '1e877228-d451-41e4-8c41-c6674ed3ea42',
                        name: 'MSSD 1',
                        store_id: 'b92d9',
                        store_type: 'N/A',
                        issuance_type: 'Main',
                        owner_id: '000',
                        location: 'ffggf',
                        is_admin: true,
                        is_counter: true,
                        is_drug_store: null,
                        status: 'Active',
                        updatedAt: '2022-03-22T10:22:21.528Z',
                        children: [
                            {
                                child_id:
                                    '2c835df3-2c72-426e-befa-ee145f7d0d64',
                                parent_id:
                                    '461f9b1a-4690-446a-9968-b8304887e8e2',
                                createdAt: '2022-03-22T10:16:13.702Z',
                                id: '461f9b1a-4690-446a-9968-b8304887e8e2',
                                department_id:
                                    '1e877228-d451-41e4-8c41-c6674ed3ea42',
                                name: 'MSD',
                                store_id: 'b02d9',
                                store_type: 'N/A',
                                issuance_type: 'Main',
                                owner_id: '000',
                                location: 'ffggf',
                                is_admin: true,
                                is_counter: true,
                                is_drug_store: null,
                                status: 'Active',
                                updatedAt: '2022-03-22T10:16:13.702Z',
                                children: [],
                            },
                        ],
                    },
                ],
            },
        ],
    }

    const section = {
        height: '600px',
        paddingTop: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
    }

    const [translate, containerRef] = useCenteredTree();
 
    return (
        <div style={section} ref={containerRef}>
            <Tree
                //data={dummyData.view[0]}
                data={props.data}
                // orientation="vertical"
                translate={translate}
                zoom={1}
                scaleExtent={{ min: 1, max: 2 }}
            
            />
        </div>
    )
}

export default FlowDiagramComp
