import React, {PropTypes} from 'react';
import {atomPropType} from '../../constants/atomPropType';

class AtomStats extends React.Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      atomType: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    atom: atomPropType
  }

  state = {
    atomUsages: [
      {
        id: 'football/video/2017/feb/27/goal-line-technology-crushes-psv-title-hopes-after-agonising-blunder-video',
        type: 'video',
        sectionId: 'football',
        sectionName: 'Football',
        webPublicationDate: '2017-02-27T16:42:30Z',
        webTitle: 'Goal-line technology crushes PSV title hopes after agonising blunder – video',
        webUrl: 'https://www.theguardian.com/football/video/2017/feb/27/goal-line-technology-crushes-psv-title-hopes-after-agonising-blunder-video',
        apiUrl: 'https://preview.content.guardianapis.com/football/video/2017/feb/27/goal-line-technology-crushes-psv-title-hopes-after-agonising-blunder-video',
        fields: {
          headline: 'Goal-line technology crushes PSV title hopes after agonising blunder – video',
          standfirst: '<p>Referee Bas Nijhuis awards Feyenoord a goal against <a href="https://www.theguardian.com/football/psveindhoven">PSV Eindhoven</a> on Sunday with the use of goal-line technology, all but ending PSV’s title hopes. In the 82nd minute, a header from Jan-Arie van der Heijden is kept out by saved by Jeroen Zoet, before the goalkeeper pulls the ball over the goal-line as he stands up to play on</p><ul><li><a href="https://www.theguardian.com/football/2017/feb/27/psv-goalkeeper-goal-line-technology-feyenoord">PSV keeper’s own-goal blunder picked up by Hawk-Eye to crush title hopes</a></li></ul>',
          trailText: 'Referee Bas Nijhuis awards Feyenoord a goal against PSV Eindhoven on Sunday with the use of goal-line technology, all but ending PSV’s title hopes',
          main: '<figure class="element element-atom"> \n <gu-atom data-atom-id="45560881-9fbf-4a04-94ba-1d36cb65fb56" data-atom-type="media"> \n  <div> \n   <iframe width="420" height="315" src="https://www.youtube.com/embed/4aFMAPfGNYU?modestbranding=1" frameborder="0" allowfullscreen> </iframe> \n  </div>\n </gu-atom> \n</figure>',
          body: '',
          wordcount: '0',
          creationDate: '2017-02-27T16:26:58Z',
          firstPublicationDate: '2017-02-27T16:42:30Z',
          internalComposerCode: '58b45352e4b08ddc9a5e4359',
          internalPageCode: '3239193',
          isInappropriateForSponsorship: 'false',
          isPremoderated: 'false',
          lastModified: '2017-03-01T17:00:35Z',
          productionOffice: 'UK',
          publication: 'theguardian.com',
          shortUrl: 'https://gu.com/p/62f93',
          shouldHideAdverts: 'false',
          showInRelatedContent: 'true',
          thumbnail: 'https://media.guim.co.uk/fa3a98738bd3541a172e724c7b40d23900230a56/0_76_2269_1361/500.jpg',
          legallySensitive: 'false',
          lang: 'en',
          internalRevision: '122',
          isLive: 'true',
          internalShortId: '/p/62f93',
          bodyText: '',
          charCount: '0'
        },
        isGone: false,
        isHosted: false
      },
      {
        id: 'football/2017/feb/27/psv-goalkeeper-goal-line-technology-feyenoord',
        type: 'article',
        sectionId: 'football',
        sectionName: 'Football',
        webPublicationDate: '2017-02-27T14:33:32Z',
        webTitle: 'PSV keeper’s own-goal blunder picked up by Hawk-Eye to crush title hopes',
        webUrl: 'https://www.theguardian.com/football/2017/feb/27/psv-goalkeeper-goal-line-technology-feyenoord',
        apiUrl: 'https://preview.content.guardianapis.com/football/2017/feb/27/psv-goalkeeper-goal-line-technology-feyenoord',
        fields: {
          headline: 'PSV keeper’s own-goal blunder picked up by Hawk-Eye to crush title hopes',
          standfirst: '<p>• Goal-line system gave goal after Zoet made error of clutching ball to chest<br>• Feyenoord took big step towards title with 2-1 victory against rivals PSV</p>',
          trailText: 'The PSV goalkeeper Jeroen Zoet has claimed he could not have done more to prevent his side from conceding the goal – given by goal-line technology – that has all but ended his side’s title hopes',
          byline: 'Guardian sport',
          main: '<figure class="element element-atom"> \n <gu-atom data-atom-id="45560881-9fbf-4a04-94ba-1d36cb65fb56" data-atom-type="media"> \n  <div> \n   <iframe width="420" height="315" src="https://www.youtube.com/embed/4aFMAPfGNYU?modestbranding=1" frameborder="0" allowfullscreen> </iframe> \n  </div>\n </gu-atom> \n</figure>',
          body: '<p>The PSV Eindhoven goalkeeper Jeroen Zoet has claimed he could not have done more to prevent his side from conceding the goal – given by goal-line technology by the finest of margins – in the 2-1 defeat by Feyenoord that all but ended PSV’s title hopes.</p> \n<p>With the score 1-1, Zoet saved a close-range header from the Feyenoord defender Jan-Arie van&nbsp;der&nbsp;Heijden in the 82nd minute, but as he clutched the ball to his chest a screen on the referee Bas Nijhuis’s wrist lit up.</p> \n<aside class="element element-rich-link element--thumbnail"> \n <p> <span>Related: </span><a href="https://www.theguardian.com/football/blog/2017/feb/27/hamburg-haunted-again-at-bayern-munichs-house-of-horrors">Hamburg haunted again at Bayern Munich\'s house of horrors | Andy Brassell</a> </p> \n</aside> \n<p>Nijhuis looked down, saw the word “goal” flashing on the screen and awarded the Dutch league leaders the winning goal in a 2-1 victory. The result on Sunday brought Feyenoord within reach of their first league title since 1999 and likely ended the two-times defending champions PSV’s title aspirations.</p> \n<p>“This is seriously fucked up,” Zoet told the Dutch broadcaster NOS. “The goal-line technology made the difference and things could have been different if it had not.</p> \n<p>“He went only by his watch. If that had not happened, I think he would have said no goal. You should always keep believing in things, but the title is very far away. [It’s] a serious blow.”</p> \n<p>He later told PSV TV: “I did everything I could to prevent the ball crossing the line. According to the system, it was one millimetre over the line.”</p> \n<p>The Dutch football authorities lauded the decision. “Everybody benefits if football becomes more honest and refereeing decisions are accurate,” the Dutch football association spokesman Bas Ticheler said. “Truth is the winner.”</p> \n<p>Protesting PSV players surrounded Nijhuis after he awarded the goal but later accepted the decision and said they should have done more to win a match that was likely the last gasp in a faltering title defence. PSV are now in third place, 11 points behind Feyenoord with 10 matches to play. Ajax are second, five points behind.</p> \n<figure class="element element-image" data-media-id="554adfc631830ab1f09bd8f20b1110dbcbb4442d"> \n <img src="https://media.guim.co.uk/554adfc631830ab1f09bd8f20b1110dbcbb4442d/0_245_4860_2916/1000.jpg" alt="Feyenoord" width="1000" height="600" class="gu-image"> \n <figcaption> \n  <span class="element-image__caption">There was a sizzling atmosphere at the De Kuip Stadium as Feyenoord closed in on their first titkle since 1999.</span> \n  <span class="element-image__credit">Photograph: Chris Brunskill Ltd/Getty Images</span> \n </figcaption> \n</figure> \n<p>Compounding PSV’s misery was the fact that Feyenoord’s De&nbsp;Kuip Stadium is the only Dutch ground with goal-line technology in the second half of the season. Before the winter break, the cameras were at Ajax’s Amsterdam Arena.</p> \n<p>There have been other goals awarded by the technology in the Netherlands but none at such a crucial stage in such a high-profile match. “Luckily we have goal-line technology,” Van&nbsp;der&nbsp;Heijden said. “A goal is a goal. Technology doesn’t lie.”</p>',
          wordcount: '405',
          commentCloseDate: '2017-03-02T14:33:32Z',
          commentable: 'true',
          creationDate: '2017-02-27T13:38:42Z',
          firstPublicationDate: '2017-02-27T14:33:32Z',
          internalComposerCode: '58b42be2e4b05f755cc0ce69',
          internalOctopusCode: '12380307',
          internalPageCode: '3238756',
          isInappropriateForSponsorship: 'false',
          isPremoderated: 'false',
          lastModified: '2017-03-01T13:47:11Z',
          productionOffice: 'UK',
          publication: 'The Guardian',
          shortUrl: 'https://gu.com/p/62ejp',
          shouldHideAdverts: 'false',
          showInRelatedContent: 'true',
          thumbnail: 'https://media.guim.co.uk/ac99e4ac59e397cc6eab366f9f255e24064b71ec/17_0_1000_600/500.jpg',
          legallySensitive: 'false',
          lang: 'en',
          internalRevision: '154',
          isLive: 'true',
          internalShortId: '/p/62ejp',
          bodyText: 'The PSV Eindhoven goalkeeper Jeroen Zoet has claimed he could not have done more to prevent his side from conceding the goal – given by goal-line technology by the finest of margins – in the 2-1 defeat by Feyenoord that all but ended PSV’s title hopes. With the score 1-1, Zoet saved a close-range header from the Feyenoord defender Jan-Arie van&nbsp;der&nbsp;Heijden in the 82nd minute, but as he clutched the ball to his chest a screen on the referee Bas Nijhuis’s wrist lit up. Nijhuis looked down, saw the word “goal” flashing on the screen and awarded the Dutch league leaders the winning goal in a 2-1 victory. The result on Sunday brought Feyenoord within reach of their first league title since 1999 and likely ended the two-times defending champions PSV’s title aspirations. “This is seriously fucked up,” Zoet told the Dutch broadcaster NOS. “The goal-line technology made the difference and things could have been different if it had not. “He went only by his watch. If that had not happened, I think he would have said no goal. You should always keep believing in things, but the title is very far away. [It’s] a serious blow.” He later told PSV TV: “I did everything I could to prevent the ball crossing the line. According to the system, it was one millimetre over the line.” The Dutch football authorities lauded the decision. “Everybody benefits if football becomes more honest and refereeing decisions are accurate,” the Dutch football association spokesman Bas Ticheler said. “Truth is the winner.” Protesting PSV players surrounded Nijhuis after he awarded the goal but later accepted the decision and said they should have done more to win a match that was likely the last gasp in a faltering title defence. PSV are now in third place, 11 points behind Feyenoord with 10 matches to play. Ajax are second, five points behind. Compounding PSV’s misery was the fact that Feyenoord’s De&nbsp;Kuip Stadium is the only Dutch ground with goal-line technology in the second half of the season. Before the winter break, the cameras were at Ajax’s Amsterdam Arena. There have been other goals awarded by the technology in the Netherlands but none at such a crucial stage in such a high-profile match. “Luckily we have goal-line technology,” Van&nbsp;der&nbsp;Heijden said. “A goal is a goal. Technology doesn’t lie.”',
          charCount: '2326'
        },
        isGone: false,
        isHosted: false
      }
    ]
  }


  renderAtomDetail = (name, value) => {
    return (
      <li key={name} className="details-list__item">
        <span className="details-list__title">{name}:</span> {value}
      </li>
    );
  }

  renderAtomDetails = () => {
    if(this.props.atom) {
      const atomType = this.props.routeParams.atomType.toLowerCase();
      return (
        <ul className="details-list">
          {
            Object.keys(this.props.atom.data[atomType])
            .map(key => this.renderAtomDetail(key, this.props.atom.data[atomType][key]))
          }
        </ul>
      );
    }
  }

  renderAtomUsage = (usage) => {
    return (
      <li>
        <p>{usage.fields.headline}</p>
      </li>
    )
  }

  renderAtomUsages = () => {
    if(this.state.atomUsages) {
      return (
        <ul>
          {this.state.atomUsages.map(usage => this.renderAtomUsage(usage))}
        </ul>
      );
    }
  }

  render() {
    return (
      <div className="atom-editor">
        <h1>{this.props.atom ? this.props.atom.title : ''}</h1>
        <div className="atom-editor__form">
          {this.renderAtomDetails()}
          {this.renderAtomUsages()}
        </div>
      </div>
    );
  }
}


//REDUX CONNECTIONS
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as getAtomUsagesActions from '../../actions/AtomActions/getAtomUsages.js';

function mapStateToProps(state) {
  return {
    atom: state.atom
  };
}

function mapDispatchToProps(dispatch) {
  return {
    atomActions: bindActionCreators(Object.assign({}, getAtomUsagesActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AtomStats);
