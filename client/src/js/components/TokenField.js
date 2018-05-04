import { h } from 'hyperapp';
import './TokenField.css';
import { RefreshIcon } from '../icons';

const TokenField = ({ token, onSubmit }) => (
  <div class="token-field">
    {!token
      ? <form onsubmit={e => {
        e.preventDefault();
        onSubmit(e.target.token.value);
      }}>
        <div class="token-field--empty">
          <input type="text" name="token"
                 class="token-field__input" placeholder="Enter or generate token..."
                 autocomplete="off" spellcheck="false"/>
          <RefreshIcon class="token-field__refresh"/>
        </div>
      </form>
      : <div class="token-field--filled" onclick={() => onSubmit(null)}>
        Token in use
      </div>}
  </div>
);

export default TokenField;
