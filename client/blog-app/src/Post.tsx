export default function Post() {
  return (
    <div className="post">
      <div className="img_box">
        <img src="https://miro.medium.com/v2/resize:fit:828/0*_AJrwSXVrWPtaRk7" alt="" />
      </div>
      <div className="texts">
        <h2>Let’s Stop Calling It “Content”</h2>
        <p className="info">
          <a className="author">Clive Thompson</a>
          <time>2023-09-30 17:53</time>
        </p>
        <p className="summary">
          It was back in the late 1990s, during the delirious height of the “dot com” boom. Corporations were rolling
          out web sites, the hawt digital technology of the day. These companies all wanted their web-sites to be
          “sticky” — i.e. to give people a reason to stick around.
        </p>
      </div>
    </div>
  );
}
