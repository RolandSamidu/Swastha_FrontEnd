import React, { Component, Fragment} from "react";
import { CardTitle, LoonsCard } from "app/components/LoonsLabComponents";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";


class StvItemBaseOrder extends Component {
    render(){
        return(
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Stv Item Base Order"/>
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default StvItemBaseOrder