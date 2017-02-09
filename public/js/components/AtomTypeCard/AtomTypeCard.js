import React  from 'react'

export const AtomTypeCard = (props) => (
  <div className="atom-type" key={props.atomType.type}>
    <img className="atom-type__icon" src={`/assets/images/typeicons/${props.atomType.type}-icon.svg`} />
    <div>
      <h3>{props.atomType.fullName}</h3>
      <div>{props.atomType.description}</div>
    </div>
  </div>
)
